// src/App.tsx
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "@/contexts/AuthContext";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/layouts/MainLayout";

// Page imports grouped by feature
// Auth-related pages
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import EmailVerification from "@/pages/auth/EmailVerification";
import ForgotPassword from "@/pages/auth/ForgetPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import ProfilePage from './pages/profile/page';

// Core pages
import HomePage from "@/pages/HomePage";
import Home from "./pages/page";

// Feature pages
import MenuPage from "./pages/menu/page";
import OrderPage from "@/pages/order/page";
import ContactPage from "@/pages/contact/page";
import ReservationPage from "@/pages/reservation/page";
import CheckoutPage from "./pages/checkout/page";

// Restaurant management pages
import RestaurantRegistrationPage from "@/pages/restaurant/regestration";
import RestaurantDashboardPage from "@/pages/restaurant/dashboard";
// import RestaurantMenuPage from "@/pages/restaurant/menu";
// import RestaurantOrdersPage from "@/pages/restaurant/orders";
// import RestaurantSettingsPage from "@/pages/restaurant/settings";

// Define route configurations for better organization
const authRoutes = [
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
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
];

const restaurantRoutes = [
  {
    path: "restaurant",
    children: [
      {
        path: "register",
        element: <RestaurantRegistrationPage />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute allowedRoles={['RESTAURANT_OWNER', 'ADMIN']}>
            <RestaurantDashboardPage />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "menu",
      //   element: (
      //     <ProtectedRoute allowedRoles={['RESTAURANT_OWNER', 'ADMIN']}>
      //       <RestaurantMenuPage />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "orders",
      //   element: (
      //     <ProtectedRoute allowedRoles={['RESTAURANT_OWNER', 'ADMIN']}>
      //       <RestaurantOrdersPage />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "settings",
      //   element: (
      //     <ProtectedRoute allowedRoles={['RESTAURANT_OWNER', 'ADMIN']}>
      //       <RestaurantSettingsPage />
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },
];

const mainRoutes = [
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [

      {
        index: true,
        element: <Home />,
      },
      {
        path: "home",
        element: (
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
        )
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "menu",
        element: <MenuPage />,
      },
      {
        path: "order",
        element: (
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "reservation",
        element: (
          <ProtectedRoute>
            <ReservationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      // Include restaurant routes as a child of main layout
      ...restaurantRoutes,
    ],
  },
  // Auth routes kept separate from main layout
  ...authRoutes,
];

// Create the router with all routes and configuration
const router = createBrowserRouter(mainRoutes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

// App component with providers
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