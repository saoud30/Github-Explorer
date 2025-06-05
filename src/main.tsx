import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LinearScale,
  PointElement,
  BubbleController
} from 'chart.js';
import App from './App.tsx';
import './index.css';

// Register Chart.js components globally
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LinearScale,
  PointElement,
  BubbleController
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);