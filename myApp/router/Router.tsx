import { createBrowserRouter } from "react-router-dom";
import ProductsCatalog from "../presentation/ProductsCatalog";
import RootLayout from "./RootLayout";
import CartScreen from "../presentation/CartScreen";

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
    ],
  },
]);
