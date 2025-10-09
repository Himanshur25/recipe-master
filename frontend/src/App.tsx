import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import RecipeHomePage from "./components/RecipeHomePage";
import "./index.css";
import GuestRoute from "./routes/GuestRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFoundPage from "./ErrorPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - redirects to /auth */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth route */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <AuthPage />
            </GuestRoute>
          }
        />

        {/* Recipe home page route */}
        <Route
          path="/recipe"
          element={
            <ProtectedRoute>
              <RecipeHomePage />
            </ProtectedRoute>
          }
        />
        {/* TO capture wrong route */}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
