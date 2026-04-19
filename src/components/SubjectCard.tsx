import { BookOpen, Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface IProps {
  id: number;
  name: string;
  uploaded: string;
  color: string;
  onEdit: () => void;
  onDelete:()=>void;
}

const SubjectCard = ({ id, name, uploaded, color,onEdit,onDelete }: IProps) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`/subject/${id}`);
      }}
      className="relative cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-fade-up  "
      style={{
        background: "#ffffff",
        border: "1px solid #e5e5e5",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        animationDelay: `${1 * 0.1}s`,
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
            onEdit();
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
          style={{ background: "#f7f7f5" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e5e5e5";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f7f7f5";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <Pencil className="w-4 h-4" style={{ color: "#555555" }} />
        </button>

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
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: color }}
      >
        <BookOpen className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ color: "#1a1a1a" }}>
        {name}
      </h3>
      <p className="text-sm text-gray-500 " style={{ color: "#777777" }}>
        {uploaded} files uploaded
      </p>
    </div>
  );
};

export default SubjectCard;
