import { Route, Routes } from "react-router-dom";
import TodoManager from "./features/Main/NotesManager/NotesManager";
import Layout from "./features/Main/Layout";
import Auth from "./features/Auth";
import { PrivateRoute } from "./components/PrivateRoute";
import { QueryClient, QueryClientProvider } from "react-query";

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<PrivateRoute element={<Layout />} />}>
          <Route index element={<TodoManager />} />
        </Route>

        <Route path="/auth" element={<Auth />} />

        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
