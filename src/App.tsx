/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}
