import { createBrowserRouter } from "react-router-dom";
import ProductsCatalog from "../presentation/ProductsCatalog";
import RootLayout from "./RootLayout";
import CartScreen from "../presentation/CartScreen";
import LoginPage from "../presentation/LoginPage";
import RegisterPage from "../presentation/RegisterPage";
import DemandsView from "../presentation/DemandsView";
import DemandItemPage from "../presentation/DemandItemPage"; // Import the component

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <ProductsCatalog />,
      },
      {
        path: "/Cart",
        element: <CartScreen />,
      },
      {
        path: "/Login",
        element: <LoginPage />,
      },
      {
        path: "/Register",
        element: <RegisterPage />,
      },
      {
        path: "/DemandsView",
        element: <DemandsView />,
      },
      {
        path: "/Demand/:demandId", // Dynamic path for individual demand
        element: <DemandItemPage />,
      },
    ],
  },
]);
