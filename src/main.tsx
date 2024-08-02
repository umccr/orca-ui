import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';

// Import the global styles
import './main.css';
import 'react-toastify/dist/ReactToastify.css';
import '@xyflow/react/dist/style.css';

// Import the amplify configuration
import config from './config';

Amplify.configure(
  {
    Auth: {
      Cognito: {
        userPoolId: config.cognito.USER_POOL_ID,
        userPoolClientId: config.cognito.APP_CLIENT_ID,
        loginWith: {
          oauth: config.cognito.OAUTH,
        },
        identityPoolId: config.cognito.IDENTITY_POOL_ID,
      },
    },
    API: {
      REST: {
        metadata: {
          endpoint: config.apiEndpoint.metadata,
          region: config.region,
        },
      },
    },
  },
  {
    API: {
      REST: {
        headers: async () => {
          const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
          return { Authorization: `${authToken!}` };
        },
      },
    },
  }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
