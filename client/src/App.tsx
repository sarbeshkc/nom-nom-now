import { AuthProvider } from "@/contexts/AuthContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import HomePage from "@/pages/HomePage";
import ContactPage from "@/pages/contact/page";
import ReservationPage from "@/pages/reservation/page";
import OrderPage from "@/pages/order/page";
import MenuPage from "@/pages/menu/page";
import Home from "./pages/page";
import { CartPage } from "./pages/checkout/cart-page";
// Define the routes using createBrowserRouter
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          ),
        },
        {path: "checkout", element: <CartPage items={[]} onNext={function (): void {
          throw new Error("Function not implemented.");
        } }/>},
        { path: "home", element: <Home />},
        { path: "menu", element: <MenuPage /> },
        { path: "order", element: <OrderPage /> },
        { path: "reservation", element: <ReservationPage /> },
        { path: "contact", element: <ContactPage /> },

      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/signup",
      element: <SignupPage />,
    },
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
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
