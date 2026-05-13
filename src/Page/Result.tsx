import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import  Navbar from '../components/Navbar';
import api from "../config/axios.config";

type Difficulty = 'easy' | 'medium' | 'hard';
interface ResultSummary {
  id: number;
  quiz_id: number;
  score: number;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  accuracy: number;
  start_time?: string;
  end_time?: string;
  difficulty?: Difficulty;
  quiz?: {
    id: number;
    title: string;
    difficulty?: Difficulty;
    subject_id?: number;
  };
}
interface ResultSummaryResponse {
  message: string;
  data: ResultSummary;
}

interface ResultDetailItem {
  question_id: number;
  question_text: string;
  explanation?: string | null;

  selected_option_id: number | null;
  selected_option_label: string | null;
  selected_option_text: string | null;

  correct_option_id: number | null;
  correct_option_label: string | null;
  correct_option_text: string | null;

  is_correct: boolean;
}

interface ResultDetailsResponse {
  message: string;
  data: {
    result_id: number;
    quiz_id: number;
    quiz_title: string;
    difficulty: Difficulty;
    answers: ResultDetailItem[];
  };
}
export function QuizResult() {
  const navigate = useNavigate();
  const { resultId } = useParams<{ resultId: string }>();

const [result, setResult] = useState<ResultSummary | null>(null);
const [details, setDetails] = useState<ResultDetailItem[]>([]);
const [showDetails, setShowDetails] = useState(false);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  if (!resultId) {
    navigate('/dashboard');
    return;
  }

  const fetchResult = async () => {
    try {
      setLoading(true);
      setError(null);

      const summaryResponse = await api.get<ResultSummaryResponse>(
        `/results/${resultId}`
      );

      const detailsResponse = await api.get<ResultDetailsResponse>(
        `/results/${resultId}/details`
      );
console.log('details response:', detailsResponse.data);
      setResult(summaryResponse.data.data);
     setDetails(detailsResponse.data.data.answers ?? []);
    } catch (err) {
      console.error(err);
      setError('Failed to load result');
    } finally {
      setLoading(false);
    }
  };

  fetchResult();
}, [resultId, navigate]);

if (loading) {
  return (
    <div className="min-h-screen" style={{ background: '#f7f7f5' }}>
      <Navbar />
      <div className="max-w-[800px] mx-auto px-4 md:px-8 py-20">
        <p>Loading result...</p>
      </div>
    </div>
  );
}

if (error || !result) {
  return (
    <div className="min-h-screen" style={{ background: '#f7f7f5' }}>
      <Navbar />
      <div className="max-w-[800px] mx-auto px-4 md:px-8 py-20">
        <p>{error ?? 'Result not found'}</p>
      </div>
    </div>
  );
}

const accuracy = result.accuracy;
const wrongAnswers = result.wrong_answers;
const difficulty = result.quiz?.difficulty ?? result.difficulty ?? 'medium';
const formatDuration = (start?: string, end?: string) => {
  if (!start || !end) return 'Not available';

  const startDate = new Date(start);
  const endDate = new Date(end);

  const diffInSeconds = Math.max(
    0,
    Math.floor((endDate.getTime() - startDate.getTime()) / 1000)
  );

  const minutes = Math.floor(diffInSeconds / 60);
  const seconds = diffInSeconds % 60;

  return `${minutes} min ${seconds} sec`;
};

const timeTaken = formatDuration(result.start_time, result.end_time);
  const getPerformanceMessage = () => {
    if (accuracy >= 90) return 'Outstanding! 🎉';
    if (accuracy >= 80) return 'Great job!';
    if (accuracy >= 70) return 'Well done!';
    if (accuracy >= 60) return 'Good effort!';
    return 'Keep practicing!';
  };

const handleRetakeQuiz = () => {
  if (result.quiz?.subject_id) {
    navigate(`/quiz/${result.quiz.subject_id}`);
  } else {
    navigate('/dashboard');
  }
};

const handleBackToSubject = () => {
  navigate('/dashboard');
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
            {result.quiz?.title ?? 'Quiz Result'}
          </h1>

          {/* Difficulty Badge */}
         <div
  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
  style={{
    background:
      difficulty === 'easy'
        ? '#d1fae5'
        : difficulty === 'medium'
        ? '#fef3c7'
        : '#fee2e2',
    color: '#1a1a1a',
  }}
>
  <span className="text-sm font-medium capitalize">{difficulty} Mode</span>
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
            {result.correct_answers} / {result.total_questions}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Correct Answers */}
            <div
              className="p-4 rounded-2xl"
              style={{ background: '#f7f7f5' }}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />
                <span className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                  {result.correct_answers}
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
            <div
  className="p-4 rounded-2xl"
  style={{ background: '#f7f7f5' }}
>
  <div className="flex items-center justify-center gap-2 mb-2">
    <span className="text-xl font-bold" style={{ color: '#1a1a1a' }}>
      {timeTaken}
    </span>
  </div>
  <p className="text-sm" style={{ color: '#555555' }}>
    Time Taken
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

            {details.map((item, index) => {
              const isCorrect = item.is_correct;
const wasAnswered = item.selected_option_id !== null && item.selected_option_id !== undefined;        
return (
                <div
                  key={item.question_id}
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
                        {item.question_text}
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
{wasAnswered ? (
  <span>
    <span className="font-bold">{item.selected_option_label}.</span>{' '}
    {item.selected_option_text}
  </span>
) : (
  'Not answered'
)}
                          </div>
                        </div>

                        {/* Correct Answer (if wrong) */}
{!isCorrect && item.correct_option_id && (
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
      <span className="font-bold">{item.correct_option_label}.</span>{' '}
      {item.correct_option_text}
    </div>
  </div>
)}
{item.explanation && (
  <p className="mt-3 text-sm" style={{ color: '#555555' }}>
    Explanation: {item.explanation}
  </p>
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
