import { FileText, Trash } from "lucide-react";

interface IProps {
  key: number;
  name: string;
  date: string;
  onDelete: () => void;
}

const FileCard = ({ key, name, date, onDelete}: IProps) => {
  return (
    <div
      key={key}
      className="relative transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-fade-up"
      style={{
        background: "#ffffff",
        border: "1px solid #e5e5e5",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        animationDelay: `${key * 0.1}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#555555";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e5e5e5";
      }}
    >
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
          style={{ background: "#f7f7f5" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fee2e2";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f7f7f5";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <Trash className="w-4 h-4" style={{ color: "#ef4444" }} />
        </button>
      </div>
      {/* File Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: "#f7f7f5" }}
      >
        <FileText className="w-6 h-6" style={{ color: "#555555" }} />
      </div>

      {/* File Name */}
      <h3
        className="font-bold text-base mb-2 line-clamp-2"
        style={{ color: "#1a1a1a" }}
      >
        {name}
      </h3>

      {/* Upload Date */}
      <p className="text-sm mb-4" style={{ color: "#777777" }}>
        Uploaded{" "}
        {new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      <div className="flex gap-2">
        <button
          //  onClick={() => handleGenerateSummary(file.id)}
          className="flex-1 h-9 px-3 rounded-lg text-sm font-medium transition-all duration-300 hover:-translate-y-1"
          style={{
            background: "#f7f7f5",
            color: "#1a1a1a",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#5b8dd9";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f7f7f5";
            e.currentTarget.style.color = "#1a1a1a";
          }}
        >
          Summary
        </button>

        <button
          //  onClick={() => handleGenerateQuiz(file.id)}
          className="flex-1 h-9 px-3 rounded-lg text-sm font-medium transition-all duration-300 hover:-translate-y-1"
          style={{
            background: "#f7f7f5",
            color: "#1a1a1a",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#5b8dd9";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f7f7f5";
            e.currentTarget.style.color = "#1a1a1a";
          }}
        >
          Quiz
        </button>
      </div>
    </div>
  );
};

export default FileCard;
