import Files from "@/pages/About";
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
      path="/files"
      element={
        <div className="animate-fade-in-up">
          <Files />
        </div>
      }
    />
  </Routes>
);

export default AppRoutes;
