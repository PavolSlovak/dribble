import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, UNSAFE_RemixErrorBoundary } from "react-router-dom";
import { AuthProvider } from "./store/authContext.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "./features/ErrorPage.tsx";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary FallbackComponent={ErrorPage}>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </ErrorBoundary>
);
