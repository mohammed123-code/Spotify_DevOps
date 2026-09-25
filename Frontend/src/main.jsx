import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import PlayerContextProvider from "./context/PlayerContext.jsx";
import AuthContextProvider from "./context/AuthContext.jsx";
import LibraryContextProvider from "./context/LibraryContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <PlayerContextProvider>
          <LibraryContextProvider>
            <App />
          </LibraryContextProvider>
        </PlayerContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
