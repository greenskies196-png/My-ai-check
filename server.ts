import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Hardcoded categories
const CATEGORIES = [
  { name: 'AI Agent Frameworks', query: 'AI agent framework' },
  { name: 'AI Coding Tools', query: 'AI coding assistant' },
  { name: 'Developer Tools on APIs', query: 'LLM developer tools' },
  { name: 'Lightweight LLM Projects', query: 'lightweight LLM efficient' }
];

app.use(express.json());

// Create API router
const apiRouter = express.Router();

let cachedCategories: any = null;
let cacheTime = 0;

apiRouter.get('/categories', async (req, res) => {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GITHUB_TOKEN environment variable is required' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is required' });
  }
  
  if (cachedCategories && Date.now() - cacheTime < 1000 * 60 * 60) {
    // 1 hour cache
    return res.json({ categories: cachedCategories });
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  try {
    const fetchCategory = async (category: { name: string; query: string }) => {
      console.log(`Getting repos for ${category.name}...`);
      
      const ghRes = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(category.query)}&sort=stars&per_page=5`,
        {
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'AI-Studio-Stats-App'
          }
        }
      );
      
      if (!ghRes.ok) throw new Error(`GitHub API error: ${ghRes.status} ${ghRes.statusText}`);
      
      const ghData = (await ghRes.json()) as any;
      const projects = ghData.items || [];
      
      // Get READMEs for all projects
      console.log(`Getting readmes for ${category.name}...`);
      const projectDetails = await Promise.all(
        projects.map(async (p: any) => {
          let readmeTrimmed = '';
          try {
            const readmeRes = await fetch(
              `https://api.github.com/repos/${p.owner.login}/${p.name}/readme`,
              {
                headers: {
                  'Authorization': `Bearer ${GITHUB_TOKEN}`,
                  'Accept': 'application/vnd.github.v3.raw',
                  'User-Agent': 'AI-Studio-Stats-App'
                }
              }
            );
            if (readmeRes.ok) {
              const readmeRaw = await readmeRes.text();
              // Trim to first 2000 words
              readmeTrimmed = readmeRaw.split(/\s+/).slice(0, 2000).join(' ');
            }
          } catch (err) {
            console.warn(`Failed to fetch readme for ${p.name}`);
          }
          
          return {
            name: p.name,
            owner: p.owner.login,
            url: p.html_url,
            description: p.description,
            stars: p.stargazers_count,
            language: p.language,
            lastUpdated: p.updated_at,
            readmeTrimmed
          };
        })
      );
      
      console.log(`Asking Gemini about ${category.name}...`);
      
      // Build batch prompt for Gemini
      const prompt = `
I have ${projectDetails.length} GitHub projects from the category "${category.name}".
For each one, I will provide its README text (trimmed).

Please summarize EACH project individually.
Format your output as a JSON array exactly matching the input order, where each element is a JSON object with these keys:
"name": The project name
"summary": A 3-point summary in plain English (what it does, how far along it is, and who it is for) - combine it into a single clean paragraph or use bullet points, but output it as one single string.

Projects:
${projectDetails.map((p, i) => `--- PROJECT ${i + 1}: ${p.name} ---\n${p.readmeTrimmed}\n\n`).join('\n')}
      `.trim();
      
      try {
        const response = await ai.models.generateContent({
           model: 'gemini-2.5-flash',
           contents: prompt,
           config: {
             responseMimeType: 'application/json',
             responseSchema: {
               type: 'ARRAY',
               items: {
                 type: 'OBJECT',
                 properties: {
                   name: { type: 'STRING' },
                   summary: { type: 'STRING' }
                 },
                 required: ['name', 'summary']
               }
             }
           }
        });
        
        const textResp = response.text;
        const summaries = JSON.parse(textResp || '[]');
        
        // merge summaries back
        for (const p of projectDetails) {
          const match = summaries.find((s: any) => s.name.toLowerCase() === p.name.toLowerCase());
          p.summary = match ? match.summary : "Summary could not be generated.";
          delete p.readmeTrimmed; // cleanup before sending to client
        }
      } catch (err) {
        console.error(`Gemini Error on ${category.name}:`, err);
        for (const p of projectDetails) {
           p.summary = "Summary generation failed.";
           delete p.readmeTrimmed; 
        }
      }
      
      return {
        name: category.name,
        projects: projectDetails
      };
    };
    
    // Instead of parallelizing all 4, let's do them parallel. 
    // Gemini 15 RPM is safe for 4 concurrent requests.
    const allCategories = await Promise.all(
       CATEGORIES.map(c => fetchCategory(c))
    );
    
    cachedCategories = allCategories;
    cacheTime = Date.now();
    
    return res.json({ categories: allCategories });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

app.use('/api', apiRouter);

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // In Dev mode, use Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In Prod, serve dist dir directly
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
       res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
