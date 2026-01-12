"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getThemeByDate } from "@lib/util/get-theme-by-date";

export type Theme = "spring" | "summer" | "autumn" | "winter";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Lo stato iniziale viene letto in modo sicuro sul client.
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "winter"; // Valore di default per il server
    }
    return (
      (document.documentElement.getAttribute("data-theme") as Theme) || "winter"
    );
  });

  // Questo effetto si assicura che il DOM sia sincronizzato con lo stato di React
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.className = `theme-${theme}`; // Sostituisce tutte le classi
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      // Quando l'utente cambia tema, salviamo la sua preferenza.
      localStorage.setItem("theme_user_set", "1");
    },
    []
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
