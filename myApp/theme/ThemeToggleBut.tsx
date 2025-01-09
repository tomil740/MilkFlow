// src/components/ThemeToggleButton.tsx
import { useTheme } from "./useTheme";

const ThemeToggleBut = () => {
  const { theme, toggleTheme } = useTheme();

  return ( 
    <button onClick={toggleTheme}>
      Switch to {theme === "light" ? "Dark" : "Light"} Theme
    </button>
  );
};

export default ThemeToggleBut;
