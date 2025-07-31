import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-12">
      <Loader2 className="animate-spin text-blue-500 mb-3" size={32} />
      <p className="text-blue-600 dark:text-blue-400 font-medium text-center">
        Fetching data...
      </p>
    </div>
  );
};

