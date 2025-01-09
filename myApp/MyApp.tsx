import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import ThemeToggleBut from "./theme/ThemeToggleBut";


export default function MyApp() {
  return (
    <RecoilRoot>
      <>
        <ThemeToggleBut/>
        <h1>Hello world </h1>
      </>
    </RecoilRoot> 
  );
}
