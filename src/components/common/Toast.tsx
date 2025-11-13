import { toast } from "react-fox-toast";
export const Toast = (type: "success" | "error" | "info", message: string) => {
  toast[type](
    <div className="flex items-center gap-2">
      <span>{message}</span>
    </div>
  );
};
