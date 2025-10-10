import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Switcher = () => {
  const getThemeFromStorage = () => {
    const stored = localStorage.getItem("theme");
    return stored === "dark" ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getThemeFromStorage);
  const isDark = theme === "dark";

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTheme = getThemeFromStorage();
      if (currentTheme !== theme) {
        setTheme(currentTheme);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggle = () => {
    const newTheme = isDark ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={toggle}
            className="flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer transition-transform duration-300"
          >
            {isDark ? (
              <Moon
                size={28}
                className="text-gray-300 transition-transform duration-500"
              />
            ) : (
              <Sun
                size={28}
                className="text-yellow-400 transition-transform duration-500"
              />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {isDark ? "Switch to Light" : "Switch to Dark"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
