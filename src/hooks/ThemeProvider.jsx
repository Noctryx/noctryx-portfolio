import { useEffect } from "react";
import { ThemeContext } from "./themeContext";

export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const isDark = true;

  return (
    <ThemeContext.Provider value={{ isDark }}>{children}</ThemeContext.Provider>
  );
}
