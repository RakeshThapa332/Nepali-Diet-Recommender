import React from "react";
import ReactDOM from "react-dom/client";
//import { ThemeProvider, CssBaseline } from "@mui/material";
import { ThemeContextProvider } from "./context/ThemeContext";
import App from "./App";
//import { theme } from "./theme/theme";
import { AuthProvider } from "./context/AuthContext";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeContextProvider>

      <AuthProvider>
        <App />
      </AuthProvider>
      
    </ThemeContextProvider>
  </React.StrictMode>
);