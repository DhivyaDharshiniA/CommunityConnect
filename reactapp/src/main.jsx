import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId="1025559189808-1i6ag2qsiu4k3juobmpe70l1hatvfpo1.apps.googleusercontent.com">
    <StrictMode>
        <App />
    </StrictMode>
    </GoogleOAuthProvider>
)
