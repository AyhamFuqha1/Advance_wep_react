import {Zap,Trophy,Target} from 'lucide-react';
type Difficulty = 'easy' | 'medium' | 'hard';

interface QuestionOption {
  id: string;
  question_id: string;
  question_label: string;
  option_text: string;
  is_correct: boolean;
}

interface QuizQuestion {
  id: string;
  quiz_id: string;
  text: string;
  explanation?: string;
  difficulty: Difficulty;
  options: QuestionOption[];
}

interface QuizModeButtonProps {
  type: Difficulty;
  allQuestions: QuizQuestion[];
  handleSelectDifficulty: (difficulty: Difficulty) => void;
}
export default function QuizModeButton({
  type,
  allQuestions,
  handleSelectDifficulty,
}: QuizModeButtonProps) {
    return(
        <div>
             <button
                onClick={() => handleSelectDifficulty(type)}
                className="w-full text-left p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '16px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = type==='easy'?'#10b981':type==='medium'?'#f59e0b':'#ef4444';
                  e.currentTarget.style.background =type==='easy'?'#f0fdf4':type==='medium'?'#fef3c7':'#fee2e2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e5e5';
                  e.currentTarget.style.background = '#ffffff';
                }}>
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: type==='easy'?'#d1fae5':type==='medium'?'#fef3c7':'#fee2e2' }}>
                        {type==='easy'?<Zap className="w-6 h-6" style={{ color: '#10b981' }} />:type==='medium'?<Target className="w-6 h-6" style={{ color: '#f59e0b' }} />:<Trophy className="w-6 h-6" style={{ color: '#ef4444' }} />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1" style={{ color: '#1a1a1a' }}>
                     {type==='easy'?'Easy':type==='medium'?'Medium':'Hard'}
                    </h3>
                    <p className="text-sm" style={{ color: '#555555' }}>
                      {type==='easy'?'Perfect for beginners':type==='medium'?'Moderate challenge':'For advanced learners'} • {allQuestions.filter(q => q.difficulty === type).length} questions
                    </p>
                  </div>
                </div>
              </button>
        </div>
    );
}