import { Outlet } from "react-router-dom";
import ThemeToggleBut from "../theme/ThemeToggleBut";

const RootLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col">
      <ThemeToggleBut />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
