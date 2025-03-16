
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Import global styles
import './styles/index.ts'

createRoot(document.getElementById("root")!).render(<App />);
