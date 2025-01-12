import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { router } from "./router/Router";



export default function MyApp() {
  return (
    <RecoilRoot>
      <>
        <RouterProvider router={router} />
      </>
    </RecoilRoot>
  );
}
