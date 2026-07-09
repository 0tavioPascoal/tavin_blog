"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeProviderProps = {
  children: ReactNode;
  attribute?: "class";
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: Dispatch<SetStateAction<Theme>>;
};

const storageKey = "theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}


function disableTransitions() {
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{transition:none!important}",
    ),
  );
  document.head.appendChild(style);

  return () => {
    window.getComputedStyle(document.body);
    setTimeout(() => document.head.removeChild(style), 1);
  };
}

function applyTheme(theme: ResolvedTheme, disableTransitionOnChange: boolean) {
  const restoreTransitions = disableTransitionOnChange
    ? disableTransitions()
    : null;
  const root = document.documentElement;

  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  restoreTransitions?.();
}

function getStoredTheme(defaultTheme: Theme): Theme {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  const storedTheme = window.localStorage.getItem(storageKey);

  return storedTheme === "light" ||
    storedTheme === "dark" ||
    storedTheme === "system"
    ? storedTheme
    : defaultTheme;
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() =>
    getStoredTheme(defaultTheme),
  );
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() =>
    getSystemTheme(),
  );

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  const setTheme = useCallback<Dispatch<SetStateAction<Theme>>>((value) => {
    setThemeState((currentTheme) => {
      const nextTheme =
        typeof value === "function" ? value(currentTheme) : value;

      window.localStorage.setItem(storageKey, nextTheme);

      return nextTheme;
    });
  }, []);

  useEffect(() => {
    applyTheme(resolvedTheme, disableTransitionOnChange);
  }, [disableTransitionOnChange, resolvedTheme]);

  useEffect(() => {
    if (!enableSystem) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setSystemTheme(getSystemTheme());

    handleChange();
    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, [enableSystem]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return;

      setThemeState(getStoredTheme(defaultTheme));
    };

    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, [defaultTheme]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [resolvedTheme, setTheme, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return value;
}

