import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./store/authContext.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "./features/ErrorPage.tsx";
import { NotesProvider } from "./store/notesContext.tsx";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary FallbackComponent={ErrorPage}>
    <AuthProvider>
      <NotesProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NotesProvider>
    </AuthProvider>
  </ErrorBoundary>
);
