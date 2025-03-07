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
    <Router
      // remove when react router v7 is integrated
      future={{
        v7_relativeSplatPath: true,
        // Many of the "Lab" pages use "useSuspenseQuery" which then doesn't show fallback (loading)
        // when this startTransition feature is enabled
        // v7_startTransition: true,
      }}
    >
      <App />
    </Router>
  </StrictMode>
);
