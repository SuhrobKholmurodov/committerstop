import { Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-auto w-full text-gray-700 dark:text-gray-300 py-3">
      <div className="container mx-auto px-4 text-center text-sm flex sm:flex-col justify-center items-center gap-2">
        <p>
          © {new Date().getFullYear()} CommittersTop TJ. Built with ❤️ by{" "}
          <a
            href="https://github.com/SuhrobKholmurodov"
            className="text-blue-600 dark:text-blue-400 hover:underline"
            target="_blank"
          >
            Suhrob Kholmurodov
          </a>
        </p>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/SuhrobKholmurodov/committerstop-tj"
            target="_blank"
            className="flex items-center gap-1 px-3 py-1 rounded-full 
               bg-gradient-to-r from-blue-400 to-blue-600 text-white
               hover:from-blue-500 hover:to-blue-700
               transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Github size={18} className="animate-pulse" />
            <span className="font-medium">Source code</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
