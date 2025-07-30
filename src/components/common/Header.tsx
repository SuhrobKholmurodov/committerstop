import { Link, useLocation } from "react-router-dom";
import { Cloud, UploadCloud, HomeIcon } from "lucide-react";

const navItems = [
  { path: "/", name: "Home", icon: <HomeIcon className="w-4 h-4 mr-2" /> },
  {
    path: "/about",
    name: "About",
    icon: <UploadCloud className="w-4 h-4 mr-2" />,
  },
];

const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-orange-100/40 backdrop-blur-md px-[200px] sm:px-2 shadow-md transition-all duration-500">
      <div className="container mx-auto sm:px-4 px-8 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors"
        >
          <div className="bg-white p-2 rounded-full shadow-md hover:scale-105 transition-transform">
            <Cloud className="w-6 h-6" />
          </div>
        </Link>

        <ul className="flex gap-10 sm:gap-2">
          {navItems.map(({ path, name, icon }) => {
            const isActive = location.pathname === path;
            return (
              <li key={path}>
                <Link
                  to={path}
                  className={`flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isActive
                      ? "text-orange-600 bg-white shadow-md"
                      : "text-gray-700 hover:text-orange-500 hover:bg-orange-100"
                  }`}
                >
                  <span className="ml-2">{icon}</span>
                  <span className="sm:hidden inline">{name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
};

export default Header;
