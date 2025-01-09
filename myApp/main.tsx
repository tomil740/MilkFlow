import ReactDOM from "react-dom/client";
import { ThemeProvider } from './theme/ThemeProvider';
import "./theme/theme.css"; 
import { StrictMode } from "react";
import MyApp from "./MyApp";



ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ThemeProvider>
      <MyApp/>
    </ThemeProvider>
  </StrictMode>
)