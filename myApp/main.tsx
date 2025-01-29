import ReactDOM from "react-dom/client";
import { ThemeProvider } from './theme/ThemeProvider';
import "./theme/theme.css"; 
import { StrictMode } from "react";
import MyApp from "./MyApp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ThemeProvider>
        <QueryClientProvider client={queryClient}>
      <MyApp/>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
)