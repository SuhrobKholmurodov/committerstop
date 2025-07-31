import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-fox-toast";
import AppRoutes from "./routes";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <main className="mx-auto px-[200px] sm:px-1 sm:py-0 py-8">
          <AppRoutes />
        </main>
        <ToastContainer />
      </div>
    </Router>
  );
};

export default App;
