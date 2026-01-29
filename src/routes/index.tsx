import Country from "@/pages/Country";
import Home from "@/pages/Home";
import { Route, Routes } from "react-router-dom";

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <div className="animate-fade-in-up">
          <Home />
        </div>
      }
    />
    <Route
      path="/:slug"
      element={
        <div className="animate-fade-in-up">
          <Country />
        </div>
      }
    />
  </Routes>
);

export default AppRoutes;
