import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { CheckCircle, XCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import  Navbar from '../components/Navbar';

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

interface QuizResults {
  quizId: string;
  quizTitle: string;
  difficulty: Difficulty;
  totalQuestions: number;
  correctAnswers: number;
  selectedAnswers: { [key: number]: string };
  questions: QuizQuestion[];
}

export function QuizResult() {
  const navigate = useNavigate();
  const { quizId } = useParams();
 const results:QuizResults | null = (() => {
  const storedResults = sessionStorage.getItem('quizResults');
  return storedResults ? JSON.parse(storedResults) : null;
})();   
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!results) {
      navigate('/dashboard');
    }
  }, [results,navigate]);

  if (!results) return null;

  const accuracy = Math.round((results.correctAnswers / results.totalQuestions) * 100);
  const wrongAnswers = results.totalQuestions - results.correctAnswers;

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return 'Outstanding! 🎉';
    if (accuracy >= 80) return 'Great job!';
    if (accuracy >= 70) return 'Well done!';
    if (accuracy >= 60) return 'Good effort!';
    return 'Keep practicing!';
  };

  const handleRetakeQuiz = () => {
    sessionStorage.removeItem('quizResults');
    navigate(`/quiz/${quizId}`);
  };

  const handleBackToSubject = () => {
    sessionStorage.removeItem('quizResults');
    navigate("/"); // Go back 2 pages (skip quiz page)
  };

  return (
    <div className="min-h-screen" style={{ background: '#f7f7f5' }}>
      <Navbar />

      <div className="max-w-[800px] mx-auto px-4 md:px-8 py-20">
        {/* Result Summary Card */}
        <div
          className="mb-12 text-center animate-fade-up"
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>

          {/* Title */}
          <h1
            className="font-serif mb-3"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              color: '#1a1a1a'
            }}>
            {results.quizTitle}
          </h1>

          {/* Difficulty Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{
              background: results.difficulty === 'easy' ? '#d1fae5' : results.difficulty === 'medium' ? '#fef3c7' : '#fee2e2',
              color: '#1a1a1a'
            }}>
            <span className="text-sm font-medium capitalize">{results.difficulty} Mode</span>
          </div>

          {/* Performance Message */}
          <p
            className="text-xl mb-8"
            style={{ color: '#555555' }}>
            {getPerformanceMessage()}
          </p>

          {/* Score Display */}
          <div
            className="text-6xl md:text-7xl font-serif mb-3"
            style={{ color: '#1a1a1a' }}>
            {results.correctAnswers} / {results.totalQuestions}
          </div>

          <p
            className="text-lg mb-8"
            style={{ color: '#777777' }}>
            Questions Answered Correctly
          </p>

          {/* Progress Bar */}
          <div
            className="w-full h-3 rounded-full overflow-hidden mb-8"
            style={{ background: '#e5e5e5' }}>
            <div
              className="h-full rounded-full transition-all duration-1000 animate-scale-in"
              style={{
                width: `${accuracy}%`,
                background: accuracy >= 70 ? '#10b981' : accuracy >= 50 ? '#f59e0b' : '#ef4444'
              }} />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Correct Answers */}
            <div
              className="p-4 rounded-2xl"
              style={{ background: '#f7f7f5' }}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />
                <span className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                  {results.correctAnswers}
                </span>
              </div>
              <p className="text-sm" style={{ color: '#555555' }}>
                Correct Answers
              </p>
            </div>

            {/* Wrong Answers */}
            <div
              className="p-4 rounded-2xl"
              style={{ background: '#f7f7f5' }}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <XCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
                <span className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                  {wrongAnswers}
                </span>
              </div>
              <p className="text-sm" style={{ color: '#555555' }}>
                Wrong Answers
              </p>
            </div>

            {/* Accuracy */}
            <div
              className="p-4 rounded-2xl"
              style={{ background: '#f7f7f5' }}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                  {accuracy}%
                </span>
              </div>
              <p className="text-sm" style={{ color: '#555555' }}>
                Accuracy
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRetakeQuiz}
              className="h-11 px-6 rounded-full flex items-center gap-2 font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg w-full md:w-auto justify-center"
              style={{
                background: '#3a3a3a',
                color: '#ffffff',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#5b8dd9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#3a3a3a';
              }}>
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>

            <button
              onClick={handleBackToSubject}
              className="h-11 px-6 rounded-full flex items-center gap-2 font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg w-full md:w-auto justify-center"
              style={{
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                color: '#1a1a1a'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#555555';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e5e5';
              }}>
              <ArrowLeft className="w-4 h-4" />
              Back to Subject
            </button>
          </div>

          {/* View Details Toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-6 text-sm font-medium underline transition-colors duration-300"
            style={{ color: '#555555' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#1a1a1a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#555555';
            }}>
            {showDetails ? 'Hide' : 'View'} Detailed Answers
          </button>
        </div>

        {/* Detailed Answers Section */}
        {showDetails && (
          <div className="space-y-6 animate-fade-up">
            <h2
              className="text-2xl font-serif mb-6"
              style={{ color: '#1a1a1a' }}>
              Detailed Answers
            </h2>

            {results.questions.map((question, index) => {
              const userAnswerId = results.selectedAnswers[index];
              const userAnswerOption = question.options.find(opt => opt.id === userAnswerId);
              const correctOption = question.options.find(opt => opt.is_correct);
              const isCorrect = userAnswerOption?.is_correct || false;
              const wasAnswered = userAnswerId !== undefined;

              return (
                <div
                  key={question.id}
                  className="animate-fade-up"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    animationDelay: `${index * 0.05}s`
                  }}>

                  {/* Question Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 mt-1">
                      {isCorrect ? (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: '#d1fae5' }}>
                          <CheckCircle className="w-4 h-4" style={{ color: '#10b981' }} />
                        </div>
                      ) : (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: '#fee2e2' }}>
                          <XCircle className="w-4 h-4" style={{ color: '#ef4444' }} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3
                        className="font-medium mb-1"
                        style={{ color: '#1a1a1a' }}>
                        Question {index + 1}
                      </h3>
                      <p
                        className="text-base mb-4"
                        style={{ color: '#555555' }}>
                        {question.text}
                      </p>

                      {/* User Answer */}
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium mb-1" style={{ color: '#777777' }}>
                            Your Answer:
                          </p>
                          <div
                            className="px-4 py-2 rounded-lg inline-block"
                            style={{
                              background: isCorrect ? '#d1fae5' : '#fee2e2',
                              color: '#1a1a1a'
                            }}>
                            {wasAnswered && userAnswerOption ? (
                              <span>
                                <span className="font-bold">{userAnswerOption.question_label}.</span> {userAnswerOption.option_text}
                              </span>
                            ) : (
                              'Not answered'
                            )}
                          </div>
                        </div>

                        {/* Correct Answer (if wrong) */}
                        {!isCorrect && correctOption && (
                          <div>
                            <p className="text-sm font-medium mb-1" style={{ color: '#777777' }}>
                              Correct Answer:
                            </p>
                            <div
                              className="px-4 py-2 rounded-lg inline-block"
                              style={{
                                background: '#d1fae5',
                                color: '#1a1a1a'
                              }}>
                              <span className="font-bold">{correctOption.question_label}.</span> {correctOption.option_text}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
