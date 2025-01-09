import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import ThemeToggleBut from "./theme/ThemeToggleBut";
import ProductsCatalog from "./features/productsCatalog/ProductsCatalog";



export default function MyApp() {
  return (
    <RecoilRoot>
      <>
        <ThemeToggleBut />
        <ProductsCatalog/>
      </>
    </RecoilRoot>
  );
}
