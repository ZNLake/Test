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
    clientId="gOEkoNaxbDeDVHLXRXIEppzqD5GtvARj"
    authorizationParams={{
      redirect_uri: "http://localhost:5173/PostHome"
    }}
  >
    <App />
  </Auth0Provider>
  </BrowserRouter>
     </React.StrictMode>,
)
