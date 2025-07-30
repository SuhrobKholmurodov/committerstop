import { File } from "lucide-react";

export function fileTypeToIcon(filename: string) {
  const extension = filename.split(".").pop()?.toLowerCase();
  const className = "w-8 h-8";

  switch (extension) {
    case "pdf":
      return <File className={`${className} text-red-500`} />;
    case "doc":
    case "docx":
      return <File className={`${className} text-blue-500`} />;
    case "xls":
    case "xlsx":
      return <File className={`${className} text-green-500`} />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <File className={`${className} text-purple-500`} />;
    case "mp3":
    case "wav":
      return <File className={`${className} text-yellow-500`} />;
    case "mp4":
    case "mov":
    case "avi":
      return <File className={`${className} text-orange-500`} />;
    default:
      return <File className={`${className} text-gray-500`} />;
  }
}
