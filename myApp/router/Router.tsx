import { createBrowserRouter } from "react-router-dom"
import ProductsCatalog from "../features/productsCatalog/ProductsCatalog"
import RootLayout from "./RootLayout";
import CartScreen from "../features/cart/CartScreen";


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