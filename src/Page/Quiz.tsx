import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Clock} from 'lucide-react';
import  Navbar  from '../components/Navbar';
import QuizModeButton from '../components/QuizModeButton';
import BackButton from '../components/BackButton';

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

interface Quiz {
  id: string;
  title: string;
  subject_id: string;
  difficulty?: Difficulty;
  time_limit: number; // in minutes
  questions: QuizQuestion[];
}

export function Quiz() {
  const navigate = useNavigate();
  const { quizId } = useParams();
   const [toast, setToast] = useState<{msg:string,type:string}>({msg:"",type:""});
   const showToast = (msg: string,type: string): void => {
    setToast({msg,type});
    setTimeout(() => setToast({msg:"",type:""}), 3000);
  };

  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Mock quiz data with all questions (different difficulty levels)
  const allQuestions: QuizQuestion[] = [
    // Easy Questions
    {
      id: 'q1',
      quiz_id: quizId || '1',
      text: 'What is the value of π (pi) to 2 decimal places?',
      difficulty: 'easy',
      options: [
        { id: 'opt1', question_id: 'q1', question_label: 'A', option_text: '3.12', is_correct: false },
        { id: 'opt2', question_id: 'q1', question_label: 'B', option_text: '3.14', is_correct: true },
        { id: 'opt3', question_id: 'q1', question_label: 'C', option_text: '3.16', is_correct: false },
        { id: 'opt4', question_id: 'q1', question_label: 'D', option_text: '3.18', is_correct: false }
      ]
    },
    {
      id: 'q2',
      quiz_id: quizId || '1',
      text: 'What is the sum of angles in a triangle?',
      difficulty: 'easy',
      options: [
        { id: 'opt5', question_id: 'q2', question_label: 'A', option_text: '90°', is_correct: false },
        { id: 'opt6', question_id: 'q2', question_label: 'B', option_text: '180°', is_correct: true },
        { id: 'opt7', question_id: 'q2', question_label: 'C', option_text: '270°', is_correct: false },
        { id: 'opt8', question_id: 'q2', question_label: 'D', option_text: '360°', is_correct: false }
      ]
    },
    {
      id: 'q3',
      quiz_id: quizId || '1',
      text: 'What is the area of a circle with radius r?',
      difficulty: 'easy',
      options: [
        { id: 'opt9', question_id: 'q3', question_label: 'A', option_text: 'πr', is_correct: false },
        { id: 'opt10', question_id: 'q3', question_label: 'B', option_text: 'πr²', is_correct: true },
        { id: 'opt11', question_id: 'q3', question_label: 'C', option_text: '2πr', is_correct: false },
        { id: 'opt12', question_id: 'q3', question_label: 'D', option_text: 'πr³', is_correct: false }
      ]
    },
    {
      id: 'q4',
      quiz_id: quizId || '1',
      text: 'What is the factorial of 5 (5!)?',
      difficulty: 'easy',
      options: [
        { id: 'opt13', question_id: 'q4', question_label: 'A', option_text: '20', is_correct: false },
        { id: 'opt14', question_id: 'q4', question_label: 'B', option_text: '60', is_correct: false },
        { id: 'opt15', question_id: 'q4', question_label: 'C', option_text: '120', is_correct: true },
        { id: 'opt16', question_id: 'q4', question_label: 'D', option_text: '240', is_correct: false }
      ]
    },
    // Medium Questions
    {
      id: 'q5',
      quiz_id: quizId || '1',
      text: 'What is the derivative of x²?',
      difficulty: 'medium',
      options: [
        { id: 'opt17', question_id: 'q5', question_label: 'A', option_text: 'x', is_correct: false },
        { id: 'opt18', question_id: 'q5', question_label: 'B', option_text: '2x', is_correct: true },
        { id: 'opt19', question_id: 'q5', question_label: 'C', option_text: 'x²', is_correct: false },
        { id: 'opt20', question_id: 'q5', question_label: 'D', option_text: '2x²', is_correct: false }
      ]
    },
    {
      id: 'q6',
      quiz_id: quizId || '1',
      text: 'What is the Pythagorean theorem?',
      difficulty: 'medium',
      options: [
        { id: 'opt21', question_id: 'q6', question_label: 'A', option_text: 'a + b = c', is_correct: false },
        { id: 'opt22', question_id: 'q6', question_label: 'B', option_text: 'a² + b² = c²', is_correct: true },
        { id: 'opt23', question_id: 'q6', question_label: 'C', option_text: 'a × b = c', is_correct: false },
        { id: 'opt24', question_id: 'q6', question_label: 'D', option_text: 'a² - b² = c²', is_correct: false }
      ]
    },
    {
      id: 'q7',
      quiz_id: quizId || '1',
      text: 'What is the slope formula?',
      difficulty: 'medium',
      options: [
        { id: 'opt25', question_id: 'q7', question_label: 'A', option_text: 'y = mx + b', is_correct: false },
        { id: 'opt26', question_id: 'q7', question_label: 'B', option_text: 'm = (y₂ - y₁)/(x₂ - x₁)', is_correct: true },
        { id: 'opt27', question_id: 'q7', question_label: 'C', option_text: 'y = x²', is_correct: false },
        { id: 'opt28', question_id: 'q7', question_label: 'D', option_text: 'm = xy', is_correct: false }
      ]
    },
    {
      id: 'q8',
      quiz_id: quizId || '1',
      text: 'What is sin²θ + cos²θ equal to?',
      difficulty: 'medium',
      options: [
        { id: 'opt29', question_id: 'q8', question_label: 'A', option_text: '0', is_correct: false },
        { id: 'opt30', question_id: 'q8', question_label: 'B', option_text: '1', is_correct: true },
        { id: 'opt31', question_id: 'q8', question_label: 'C', option_text: '2', is_correct: false },
        { id: 'opt32', question_id: 'q8', question_label: 'D', option_text: 'θ', is_correct: false }
      ]
    },
    // Hard Questions
    {
      id: 'q9',
      quiz_id: quizId || '1',
      text: 'What is the integral of 1/x?',
      difficulty: 'hard',
      options: [
        { id: 'opt33', question_id: 'q9', question_label: 'A', option_text: 'ln|x| + C', is_correct: true },
        { id: 'opt34', question_id: 'q9', question_label: 'B', option_text: 'x + C', is_correct: false },
        { id: 'opt35', question_id: 'q9', question_label: 'C', option_text: '1/x² + C', is_correct: false },
        { id: 'opt36', question_id: 'q9', question_label: 'D', option_text: 'e^x + C', is_correct: false }
      ]
    },
    {
      id: 'q10',
      quiz_id: quizId || '1',
      text: 'What is the quadratic formula?',
      difficulty: 'hard',
      options: [
        { id: 'opt37', question_id: 'q10', question_label: 'A', option_text: 'x = -b ± √(b² - 4ac) / 2a', is_correct: true },
        { id: 'opt38', question_id: 'q10', question_label: 'B', option_text: 'x = b ± √(b² + 4ac) / 2a', is_correct: false },
        { id: 'opt39', question_id: 'q10', question_label: 'C', option_text: 'x = -b / 2a', is_correct: false },
        { id: 'opt40', question_id: 'q10', question_label: 'D', option_text: 'x = b² - 4ac', is_correct: false }
      ]
    },
    {
      id: 'q11',
      quiz_id: quizId || '1',
      text: 'Find the limit: lim(x→0) (sin x)/x',
      difficulty: 'hard',
      options: [
        { id: 'opt41', question_id: 'q11', question_label: 'A', option_text: '0', is_correct: false },
        { id: 'opt42', question_id: 'q11', question_label: 'B', option_text: '1', is_correct: true },
        { id: 'opt43', question_id: 'q11', question_label: 'C', option_text: '∞', is_correct: false },
        { id: 'opt44', question_id: 'q11', question_label: 'D', option_text: 'undefined', is_correct: false }
      ]
    },
    {
      id: 'q12',
      quiz_id: quizId || '1',
      text: 'What is the derivative of ln(x)?',
      difficulty: 'hard',
      options: [
        { id: 'opt45', question_id: 'q12', question_label: 'A', option_text: 'x', is_correct: false },
        { id: 'opt46', question_id: 'q12', question_label: 'B', option_text: '1/x', is_correct: true },
        { id: 'opt47', question_id: 'q12', question_label: 'C', option_text: 'e^x', is_correct: false },
        { id: 'opt48', question_id: 'q12', question_label: 'D', option_text: '1/x²', is_correct: false }
      ]
    }
  ];

  const [quiz] = useState<Quiz>({
    id: quizId || '1',
    title: 'Mathematics Quiz - Chapter 1',
    subject_id: '1',
    time_limit: 30,
    questions: allQuestions
  });

  // Filter questions based on selected difficulty
  const filteredQuestions = selectedDifficulty
    ? quiz.questions.filter(q => q.difficulty === selectedDifficulty)
    : quiz.questions;

/*   useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]); */

  useEffect(() => {
    // Initialize timer only after quiz has started
    if (!quizStarted) return;

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
  }, [quizStarted]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleSelectDifficulty = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setQuizStarted(true);
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionId
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    // Calculate score
    let correctCount = 0;
    filteredQuestions.forEach((question, index) => {
      const selectedOptionId = selectedAnswers[index];
      if (selectedOptionId) {
        const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
        if (selectedOption?.is_correct) {
          correctCount++;
        }
      }
    });

    // Store results in session storage for the result page
    sessionStorage.setItem('quizResults', JSON.stringify({
      quizId: quiz.id,
      quizTitle: quiz.title,
      difficulty: selectedDifficulty,
      totalQuestions: filteredQuestions.length,
      correctAnswers: correctCount,
      selectedAnswers,
      questions: filteredQuestions
    }));

    showToast('Quiz submitted successfully!', 'success');
    
  navigate(`/quiz/${quizId}/result`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /* if (!user) return null; */

  // Difficulty Selection Screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen" style={{ background: '#f7f7f5' }}>
        <Navbar />
        <div className="max-w-[700px] mx-auto px-4 md:px-8 py-20">
        <BackButton navigate={() => navigate(-1)} statement="Back to Subject"/>
          {/* Selection Card */}
          <div
            className="animate-fade-up"
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>

            {/* Title */}
            <h1
              className="font-serif mb-3 text-center"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                color: '#1a1a1a'
              }}>
              {quiz.title}
            </h1>

            <p
              className="text-center mb-8"
              style={{ color: '#555555' }}>
              Choose your difficulty level to begin
            </p>

            {/* Difficulty Options */}
            <div className="space-y-4">
              {/* Easy */}
             <QuizModeButton type="easy" handleSelectDifficulty={handleSelectDifficulty} allQuestions={allQuestions}/>
              {/* Medium */}
              <QuizModeButton type="medium" handleSelectDifficulty={handleSelectDifficulty} allQuestions={allQuestions}/>

              {/* Hard */}
              <QuizModeButton type="hard" handleSelectDifficulty={handleSelectDifficulty} allQuestions={allQuestions}/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Taking Screen
  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>
      <Navbar />

      <div className="max-w-[900px] mx-auto px-4 md:px-8 py-20">
        {/* Header Section */}
        <div className="mb-12 animate-fade-up">
          {/* Back Button */}
          <BackButton navigate={() => navigate(-1)} statement="Back to Subject"/>

          {/* Title and Progress */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1
                className="font-serif mb-2"
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  color: '#1a1a1a'
                }}>
                {quiz.title}
              </h1>
              <p
                className="text-base"
                style={{ color: '#555555' }}>
                Answer the following questions carefully
              </p>

              {/* Difficulty Badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full mt-2"
                style={{
                  background: selectedDifficulty === 'easy' ? '#d1fae5' : selectedDifficulty === 'medium' ? '#fef3c7' : '#fee2e2',
                  color: '#1a1a1a'
                }}>
                <span className="text-sm font-medium capitalize">{selectedDifficulty} Mode</span>
              </div>
            </div>

            {/* Timer */}
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full self-start"
              style={{
                background: '#f7f7f5',
                border: '1px solid #e5e5e5'
              }}>
              <Clock className="w-4 h-4" style={{ color: '#555555' }} />
              <span className="font-medium" style={{ color: '#1a1a1a' }}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          {/* Question Progress */}
          <p className="text-sm font-medium" style={{ color: '#777777' }}>
            Question {currentQuestionIndex + 1} of {filteredQuestions.length}
          </p>
        </div>

        {/* Question Card */}
        <div
          className="mb-8 animate-fade-up"
          style={{
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>

          {/* Question Text */}
          <h2
            className="text-xl md:text-2xl font-medium mb-8"
            style={{ color: '#1a1a1a' }}>
            {currentQuestion.text}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className="w-full text-left px-5 py-4 transition-all duration-300"
                  style={{
                    background: isSelected ? '#f7f7f5' : '#ffffff',
                    border: isSelected ? '2px solid rgba(68,68,68,0.7)' : '1px solid #e5e5e5',
                    borderRadius: '14px',
                    color: '#1a1a1a',
                    boxShadow: isSelected ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
                    transform: isSelected ? 'scale(1.01)' : 'scale(1)'
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
                  }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        border: isSelected ? '2px solid rgba(68,68,68,0.7)' : '2px solid #e5e5e5',
                        background: isSelected ? 'rgba(68,68,68,0.7)' : '#ffffff'
                      }}>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full" style={{ background: '#ffffff' }} />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold" style={{ color: '#777777' }}>{option.question_label}.</span>
                      <span className="font-medium">{option.option_text}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="h-11 px-6 rounded-full font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: '#f7f7f5',
                border: '1px solid #e5e5e5',
                color: '#1a1a1a'
              }}
              onMouseEnter={(e) => {
                if (currentQuestionIndex !== 0) {
                  e.currentTarget.style.borderColor = '#555555';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e5e5';
              }}>
              Previous
            </button>

            {currentQuestionIndex === filteredQuestions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                className="h-11 px-8 rounded-full text-white font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: '#3a3a3a',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#5b8dd9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#3a3a3a';
                }}>
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="h-11 px-8 rounded-full text-white font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: '#3a3a3a',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#5b8dd9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#3a3a3a';
                }}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
      <div className={`toast ${toast.msg ? "show" : ""}`}>{toast.msg}</div>

    </div>
    
  );
}
