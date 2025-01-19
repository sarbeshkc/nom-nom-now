// src/App.tsx
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from "@/contexts/AuthContext";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import HomePage from "@/pages/HomePage";

function App() {
  // Create the router configuration
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      ),
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          ),
        }
      ],
    },
    {
      path: "/login",
      element: (
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      ),
    },
    {
      path: "/signup",
      element: (
        <AuthProvider>
          <SignupPage />
        </AuthProvider>
      ),
    },
  ]);

  // Return just the RouterProvider
  return <RouterProvider router={router} />;
}

export default App;
