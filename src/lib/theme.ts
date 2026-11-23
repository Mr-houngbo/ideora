export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "ideora-theme";

/**
 * Pages with their own fixed light palette (the MonPays+ workspace), where the
 * app's dark tokens would put dark dialogs and inputs on a light page.
 */
export const LIGHT_ONLY_PATH = /\/workspace\/?$/;

/**
 * Runs in <head> before the first paint: applies the saved theme, or the
 * system preference when none was saved, so a dark page never flashes white.
 */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";if(${LIGHT_ONLY_PATH}.test(location.pathname))t="light";var d=document.documentElement;d.classList.toggle("dark",t==="dark");d.style.colorScheme=t}catch(e){}})()`;

function setRootTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

/** The saved theme, or the system preference when none was saved. */
export function preferredTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // Fall through to the system preference.
  }
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Forces light mode while a light-only page is shown (client navigations),
 * and returns a function that restores the preferred theme on leaving it.
 */
export function holdLightTheme(): () => void {
  setRootTheme("light");
  return () => setRootTheme(preferredTheme());
}

export function applyTheme(theme: Theme) {
  setRootTheme(theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode or blocked storage: the theme still applies for this visit.
  }
}
