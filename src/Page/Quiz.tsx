import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock } from 'lucide-react';
//import axios from 'axios';
import api from "../config/axios.config";
import Navbar from '../components/Navbar';
import QuizModeButton from '../components/QuizModeButton';
import BackButton from '../components/BackButton';

type Difficulty = 'easy' | 'medium' | 'hard';

interface QuestionOption {
  id: number;
  question_id: number;
  option_label: string;
  option_text: string;
}

interface QuizQuestion {
  id: number;
  quiz_id: number;
  question_text: string;
  explanation?: string | null;
  options: QuestionOption[];
}

interface Quiz {
  id: number;
  title: string;
  subject_id: number;
  content_id: number;
  job_id: number;
  difficulty: Difficulty;
  time_limit: number;
  questions: QuizQuestion[];
}

interface QuizResponse {
  message: string;
  data: Quiz;
}

interface SubmitResponse {
  message: string;
  data: {
    result_id: number;
    quiz_id: number;
    score: number;
    total_questions: number;
    correct_answers: number;
    wrong_answers: number;
    accuracy: number;
  };
}

export function Quiz() {
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: string }>();

  const [toast, setToast] = useState<{ msg: string; type: string }>({
    msg: '',
    type: '',
  });

  const showToast = (msg: string, type: string): void => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<string>('');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);

const fetchQuizByDifficulty = async (difficulty: Difficulty) => {
  if (!subjectId) {
    console.log('subjectId missing');
    return;
  }

  try {
    setLoading(true);
    setError(null);

    console.log('subjectId:', subjectId);
    console.log('difficulty:', difficulty);

    const response = await api.get<QuizResponse>(
  `/quizzes/${subjectId}`,
  {
    params: { difficulty },
  }
);
    console.log('API response:', response.data);

    setQuiz(response.data.data);
    setSelectedDifficulty(difficulty);
    setQuizStarted(true);
    setQuizStartTime(new Date().toISOString());
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    showToast('Quiz loaded successfully!', 'success');
  } catch (err) {
    console.error('fetch error:', err);
    setError('Failed to load quiz');
    showToast('Failed to load quiz.', 'error');
  } finally {
    setLoading(false);
  }
};

 const handleSelectDifficulty = (difficulty: Difficulty) => {
  console.log('clicked difficulty:', difficulty);
  fetchQuizByDifficulty(difficulty);
};

  useEffect(() => {
    if (!quizStarted || !quiz) return;

    setTimeRemaining(quiz.time_limit * 60);

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quiz]);

  const filteredQuestions = quiz?.questions ?? [];
  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleSelectOption = (optionId: number) => {
    if (!currentQuestion) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    try {
      setSubmitLoading(true);

      const answers = Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
        question_id: Number(questionId),
        option_id: Number(optionId),
      }));

      const response = await api.post<SubmitResponse>(
        `/quizzes/${quiz.id}/submit`,
        {
  answers,
  start_time: quizStartTime,
}
      );

      showToast('Quiz submitted successfully!', 'success');

      const resultId = response.data.data.result_id;

      navigate(`/results/${resultId}`);
    } catch (err) {
      console.error(err);
      showToast('Failed to submit quiz', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen" style={{ background: '#f7f7f5' }}>
        <Navbar />

        <div className="max-w-[700px] mx-auto px-4 md:px-8 py-20">
          <BackButton navigate={() => navigate(-1)} statement="Back to Subject" />

          <div
            className="animate-fade-up"
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }}
          >
            <h1
              className="font-serif mb-3 text-center"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                color: '#1a1a1a',
              }}
            >
              Mathematics Quiz
            </h1>

            <p className="text-center mb-8" style={{ color: '#555555' }}>
              Choose your difficulty level to begin
            </p>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <QuizModeButton
                type="easy"
                handleSelectDifficulty={handleSelectDifficulty}
                allQuestions={[]}
              />

              <QuizModeButton
                type="medium"
                handleSelectDifficulty={handleSelectDifficulty}
                allQuestions={[]}
              />

              <QuizModeButton
                type="hard"
                handleSelectDifficulty={handleSelectDifficulty}
                allQuestions={[]}
              />
            </div>

            {loading && (
              <p className="mt-6 text-center text-sm" style={{ color: '#555555' }}>
                Loading quiz...
              </p>
            )}
          </div>
        </div>

        <div className={`toast ${toast.msg ? 'show' : ''}`}>{toast.msg}</div>
      </div>
    );
  }

  if (loading || !quiz || !currentQuestion) {
    return (
      <div className="min-h-screen" style={{ background: '#ffffff' }}>
        <Navbar />
        <div className="max-w-[900px] mx-auto px-4 md:px-8 py-20">
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>
      <Navbar />

      <div className="max-w-[900px] mx-auto px-4 md:px-8 py-20">
        <div className="mb-12 animate-fade-up">
          <BackButton navigate={() => navigate(-1)} statement="Back to Subject" />

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1
                className="font-serif mb-2"
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  color: '#1a1a1a',
                }}
              >
                {quiz.title}
              </h1>

              <p className="text-base" style={{ color: '#555555' }}>
                Answer the following questions carefully
              </p>

              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full mt-2"
                style={{
                  background:
                    selectedDifficulty === 'easy'
                      ? '#d1fae5'
                      : selectedDifficulty === 'medium'
                      ? '#fef3c7'
                      : '#fee2e2',
                  color: '#1a1a1a',
                }}
              >
                <span className="text-sm font-medium capitalize">
                  {selectedDifficulty} Mode
                </span>
              </div>
            </div>

            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full self-start"
              style={{
                background: '#f7f7f5',
                border: '1px solid #e5e5e5',
              }}
            >
              <Clock className="w-4 h-4" style={{ color: '#555555' }} />
              <span className="font-medium" style={{ color: '#1a1a1a' }}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          <p className="text-sm font-medium" style={{ color: '#777777' }}>
            Question {currentQuestionIndex + 1} of {filteredQuestions.length}
          </p>
        </div>

        <div
          className="mb-8 animate-fade-up"
          style={{
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          }}
        >
          <h2 className="text-xl md:text-2xl font-medium mb-8" style={{ color: '#1a1a1a' }}>
            {currentQuestion.question_text}
          </h2>

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswers[currentQuestion.id] === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className="w-full text-left px-5 py-4 transition-all duration-300"
                  style={{
                    background: isSelected ? '#f7f7f5' : '#ffffff',
                    border: isSelected
                      ? '2px solid rgba(68,68,68,0.7)'
                      : '1px solid #e5e5e5',
                    borderRadius: '14px',
                    color: '#1a1a1a',
                    boxShadow: isSelected ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
                    transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#555555';
                      e.currentTarget.style.background = '#f7f7f5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#e5e5e5';
                      e.currentTarget.style.background = '#ffffff';
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        border: isSelected
                          ? '2px solid rgba(68,68,68,0.7)'
                          : '2px solid #e5e5e5',
                        background: isSelected ? 'rgba(68,68,68,0.7)' : '#ffffff',
                      }}
                    >
                      {isSelected && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: '#ffffff' }}
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold" style={{ color: '#777777' }}>
                        {option.option_label}.
                      </span>
                      <span className="font-medium">{option.option_text}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="h-11 px-6 rounded-full font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: '#f7f7f5',
                border: '1px solid #e5e5e5',
                color: '#1a1a1a',
              }}
              onMouseEnter={(e) => {
                if (currentQuestionIndex !== 0) {
                  e.currentTarget.style.borderColor = '#555555';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e5e5';
              }}
            >
              Previous
            </button>

            {currentQuestionIndex === filteredQuestions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitLoading}
                className="h-11 px-8 rounded-full text-white font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg disabled:opacity-60"
                style={{
                  background: '#3a3a3a',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#5b8dd9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#3a3a3a';
                }}
              >
                {submitLoading ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="h-11 px-8 rounded-full text-white font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: '#3a3a3a',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#5b8dd9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#3a3a3a';
                }}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={`toast ${toast.msg ? 'show' : ''}`}>{toast.msg}</div>
    </div>
  );
}