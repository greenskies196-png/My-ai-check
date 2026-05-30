# GitHub Open Source Tracker - Setup & Configuration Guide

Welcome to the GitHub Open Source Tracker! This application is built as a full-stack App (React + Vite + Tailwind CSS + Express + Gemini 2.5 Flash). 

Before running or deploying the application yourself outside of AI Studio, there are a few manual configuration "loopholes" you need to close—specifically around API keys and environment variables.

## 1. What You Need to Configure (Environment Variables)

When you download and extract the ZIP file, you will need to create a file named `.env` in the root folder of the project. You can copy the provided `.env.example` file and rename it to `.env`.

This `.env` file must contain the following keys:

```ini
GEMINI_API_KEY="your_actual_gemini_api_key_here"
GITHUB_TOKEN="your_actual_github_personal_access_token_here"
```

### Where to get these keys:

**A. Gemini API Key (For AI Summaries)**
1. Go to [Google AI Studio](https://aistudio.google.com/) and sign in.
2. Click on "Get API Key" or "Create API Key".
3. Copy the generated key and paste it into your `.env` file as `GEMINI_API_KEY`.

**B. GitHub Personal Access Token (For fetching Repos without rate limits)**
1. Go to [GitHub Developer Settings](https://github.com/settings/tokens).
2. Click **Generate new token (classic)**.
3. Give it a descriptive name (e.g., "OS Tracker").
4. Under scopes, you only need to tick `public_repo` (or no scopes at all, as we are only reading public repository data, but providing a token increases your rate limit massively).
5. Generate the token, copy it, and paste it into your `.env` file as `GITHUB_TOKEN`.

---

## 2. Running the App Locally

Once you have your `.env` file setup with the correct keys:

1. Ensure you have Node.js installed (v18 or higher recommended).
2. Open a terminal in the project folder.
3. Run `npm install` to install all necessary dependencies.
4. Run `npm run dev` to start the application.
5. Open your browser to the local URL provided (usually `http://localhost:3000`).

---

## 3. Deploying the App (Production)

If you plan to deploy this app to the internet (e.g., Render, Heroku, Railway, or Vercel if splitting the backend), you must add these identical keys to the Environment Variables settings of your hosting provider.

- NEVER commit your `.env` file to a public GitHub repository. Doing so will expose your API keys to the public! (The `.gitignore` file already prevents this by default).
- The current codebase is bundled as a single server (Express serving the React frontend). It's best deployed to a service that supports Node.js web servers like Render.com or Railway.app.

### Render Setup Example:
1. Create a "Web Service" on Render.
2. Connect your GitHub repository.
3. Set the Build Command to: `npm install && npm run build`
4. Set the Start Command to: `npm run start`
5. Go to the "Environment" tab and add your `GEMINI_API_KEY` and `GITHUB_TOKEN` values there.
