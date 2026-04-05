import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext";
import { CompareProvider } from "./context/CompareContext";
import { createQueryClient } from "./lib/queryClient";
import "./index.css";

function Root() {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CompareProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </CompareProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);