import { ArrowLeft } from 'lucide-react';
interface BackButtonProps {
  navigate: (arg: number) => void;
  statement: string; 
}
export default function BackButton({ navigate, statement }: BackButtonProps) {
  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 mb-8 text-base transition-all duration-300 hover:-translate-x-1 animate-fade-up"
      style={{ color: '#555555' }}>
      <ArrowLeft className="w-5 h-5" />
      {statement}
    </button>
  );
}