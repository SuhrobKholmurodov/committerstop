import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useDarkSide } from "@/hooks/useDarkSide";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Switcher = () => {
  const [colorTheme, setTheme] = useDarkSide();
  const [dark, setDark] = useState(colorTheme === "light");

  const toggle = () => {
    setTheme(dark ? "light" : "dark");
    setDark(!dark);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={toggle}
            className="flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer transition-transform duration-300 hover:scale-110"
          >
            {dark ? (
              <Moon size={28} className="text-gray-300 transition-transform duration-500" />
            ) : (
              <Sun size={28} className="text-yellow-400 transition-transform duration-500" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {dark ? "Switch to Light" : "Switch to Dark"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
