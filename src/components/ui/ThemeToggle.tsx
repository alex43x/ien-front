import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={{
        backgroundColor: isDark ? "#3E3A38" : "#C8C0BC",
      }}
    >
      <span
        className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white transition-transform duration-200"
        style={{
          transform: isDark ? "translateX(26px)" : "translateX(3px)",
        }}
      >
        {isDark ? (
          <Moon size={10} className="text-[#3E3A38]" />
        ) : (
          <Sun size={10} className="text-[#D9A030]" />
        )}
      </span>
    </button>
  );
}
