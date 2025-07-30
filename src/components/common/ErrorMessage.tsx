import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  className?: string;
}

const ErrorMessage = ({
  title = "Error loading data",
  message = "Please try again later.",
  className = "",
}: ErrorMessageProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-4 rounded-md 
      bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 ${className}`}
    >
      <AlertTriangle
        className="text-red-500 dark:text-red-400 mb-2"
        size={28}
      />
      <p className="text-red-600 dark:text-red-400 font-semibold text-lg">
        {title}
      </p>
      <p className="text-sm text-red-500 dark:text-red-300 mt-1">{message}</p>
    </div>
  );
};

export default ErrorMessage;
