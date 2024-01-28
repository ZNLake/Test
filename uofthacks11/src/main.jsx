import React from "react";
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx'

import '../index.css'
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
<BrowserRouter>
 <Auth0Provider
    domain="dev-3q743fc24vrnr2ng.us.auth0.com"
    clientId="ocUD1xYSIFGR394NR04QBa0AW1w399Il"
    authorizationParams={{
      redirect_uri: "http://localhost:15000/PostHome"
    }}
  >
    <App />
  </Auth0Provider>
  </BrowserRouter>
     </React.StrictMode>,
)
