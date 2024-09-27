import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter as Router } from 'react-router-dom';

// Import the global function styles
import './styles/main.css';
import 'react-toastify/dist/ReactToastify.css';
import '@xyflow/react/dist/style.css';
import 'flatpickr/dist/flatpickr.min.css';
import 'react-loading-skeleton/dist/skeleton.css';
import './styles/additional-styles/utility-patterns.css';
import './styles/additional-styles/flatpickr.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
