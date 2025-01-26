// src/App.tsx
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "@/contexts/AuthContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/layouts/MainLayout";

// Existing page imports
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import HomePage from "@/pages/HomePage";
import ContactPage from "@/pages/contact/page";
import ReservationPage from "@/pages/reservation/page";
import OrderPage from "@/pages/order/page";
import MenuPage from "./pages/menu/page";
import Home from "./pages/page";
import CheckoutPage from "./pages/checkout/page";

// New auth-related page imports
import EmailVerification from "@/pages/auth/EmailVerification";
// import ForgotPassword from "@/pages/auth/ForgotPassword";
// import ResetPassword from "@/pages/auth/ResetPassword";

// Define the routes using createBrowserRouter
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <ErrorBoundary />, // Add error boundary for route errors
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          ),
        },
        { 
          path: "home", 
          element: <Home />
        },
        { 
          path: "menu", 
          element: <MenuPage /> 
        },
        { 
          path: "order", 
          element: (
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          )
        },
        { 
          path: "reservation", 
          element: (
            <ProtectedRoute>
              <ReservationPage />
            </ProtectedRoute>
          )
        },
        { 
          path: "contact", 
          element: <ContactPage /> 
        },
        { 
          path: "checkout", 
          element: (
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          )
        }
      ],
    },
    // Auth routes outside MainLayout
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/signup",
      element: <SignupPage />,
    },
    {
      path: "/verify-email",
      element: <EmailVerification />,
    }
    // {
    //   path: "/forgot-password",
    //   element: <ForgotPassword />,
    // },
    // {
    //   path: "/reset-password",
    //   element: <ResetPassword />,
    // }
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;