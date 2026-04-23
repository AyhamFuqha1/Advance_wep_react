import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getStudyPlans, generateStudyPlan, getAnalytics } from '../services/api';
import {
  BookOpen,
  HelpCircle,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  ArrowRight,
  Wand2
} from 'lucide-react';

interface ApiStudyPlan {
  id: number;
  user_id: number;
  subject_id: number;
  goal: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  subject?: {
    id: number;
    name: string;
    color: string;
  };
}

interface StudyTask {
  id: string;
  subject: string;
  taskType: 'Review' | 'Quiz' | 'Summary';
  title: string;
  scheduledDate: string;
  status: 'Done' | 'Pending' | 'Missed';
  color: string;
}

export default function StudyPlan() {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const loadStudyPlans = async () => {
    try {
      const data: ApiStudyPlan[] = await getStudyPlans(1);

      const formattedTasks: StudyTask[] = data.map((plan) => ({
        id: String(plan.id),
        subject: plan.subject?.name || `Subject ${plan.subject_id}`,
        taskType: getTaskType(plan.goal),
        title: plan.goal,
        scheduledDate: formatDateLabel(plan.start_date),
        status: mapStatus(plan.status),
        color: plan.subject?.color || '#8b5cf6',
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching study plans:', error);
      setTasks([]);
    }
  };

  const loadAiSuggestions = async () => {
    try {
      const analyticsData = await getAnalytics();

      if (analyticsData?.recommendations && Array.isArray(analyticsData.recommendations)) {
        setAiSuggestions(
          analyticsData.recommendations.slice(0, 3).map((item: any) => item.message)
        );
      } else {
        setAiSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching analytics suggestions:', error);
      setAiSuggestions([]);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      try {
        setLoading(true);
        await Promise.all([loadStudyPlans(), loadAiSuggestions()]);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, []);

  const handleGenerateAIPlan = async () => {
    try {
      setGenerating(true);
      await generateStudyPlan(1);
      await loadStudyPlans();
      await loadAiSuggestions();
    } catch (error) {
      console.error('Error generating AI study plan:', error);
    } finally {
      setGenerating(false);
    }
  };

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'Review':
        return <BookOpen className="w-5 h-5" />;
      case 'Quiz':
        return <HelpCircle className="w-5 h-5" />;
      case 'Summary':
        return <FileText className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Done':
        return {
          bg: '#e8f5e9',
          color: '#2e7d32',
          icon: <CheckCircle2 className="w-4 h-4" />
        };
      case 'Pending':
        return {
          bg: '#f5f5f5',
          color: '#616161',
          icon: <Clock className="w-4 h-4" />
        };
      case 'Missed':
        return {
          bg: '#ffebee',
          color: '#c62828',
          icon: <XCircle className="w-4 h-4" />
        };
      default:
        return {
          bg: '#f5f5f5',
          color: '#616161',
          icon: <Clock className="w-4 h-4" />
        };
    }
  };

  const getTaskType = (goal: string): 'Review' | 'Quiz' | 'Summary' => {
    const text = goal.toLowerCase();

    if (text.includes('quiz')) return 'Quiz';
    if (text.includes('summary') || text.includes('read')) return 'Summary';
    return 'Review';
  };

  const mapStatus = (status: string): 'Done' | 'Pending' | 'Missed' => {
    const normalized = status.toLowerCase();

    if (normalized === 'done' || normalized === 'completed') return 'Done';
    if (normalized === 'missed') return 'Missed';
    return 'Pending';
  };

  const formatDateLabel = (dateString: string) => {
    if (!dateString) return 'No date';

    const taskDate = new Date(dateString);
    const today = new Date();

    const taskOnly = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const diffTime = taskOnly.getTime() - todayOnly.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';

    return taskDate.toLocaleDateString();
  };

  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-20">
        <div className="mb-12 animate-fade-up flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1
              className="font-serif mb-2"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                color: '#1a1a1a'
              }}>
              Study Plan
            </h1>
            <p
              className="text-lg"
              style={{ color: '#555555' }}>
              Your personalized study schedule
            </p>
          </div>

          <button
            onClick={handleGenerateAIPlan}
            disabled={generating}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: '#1a1a1a',
              color: '#ffffff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            <Wand2 className="w-4 h-4" />
            {generating ? 'Generating...' : 'Generate AI Plan'}
          </button>
        </div>

        <div
          className="mb-12 transition-all duration-300 animate-fade-up"
          style={{
            background: 'linear-gradient(135deg, #f7f7f5 0%, #ffffff 100%)',
            border: '1px solid #e5e5e5',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            animationDelay: '0.1s'
          }}>

          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5" style={{ color: '#555555' }} />
            <h2
              className="font-serif text-xl"
              style={{ color: '#1a1a1a' }}>
              AI Suggested Plan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiSuggestions.length > 0 ? (
              aiSuggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion}-${index}`}
                  className="flex items-center gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01]"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    padding: '16px',
                    animationDelay: `${0.15 + index * 0.05}s`
                  }}>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#f7f7f5' }}>
                    <ArrowRight className="w-4 h-4" style={{ color: '#555555' }} />
                  </div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: '#1a1a1a' }}>
                    {suggestion}
                  </p>
                </div>
              ))
            ) : (
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '12px',
                  padding: '16px',
                  color: '#777777'
                }}>
                No AI suggestions available yet.
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center py-10">
            <p style={{ color: '#555555' }}>Loading study plan...</p>
          </div>
        )}

        {!loading && tasks.length > 0 && (
          <div className="space-y-4">
            {tasks.map((task, index) => {
              const statusBadge = getStatusBadge(task.status);

              return (
                <div
                  key={task.id}
                  className="transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl animate-fade-up cursor-pointer"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    animationDelay: `${0.25 + index * 0.08}s`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#555555';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e5e5';
                  }}>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: task.color }}>
                        <div className="text-white">
                          {getTaskIcon(task.taskType)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3
                            className="font-bold text-lg"
                            style={{ color: '#1a1a1a' }}>
                            {task.subject}
                          </h3>
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              background: '#f7f7f5',
                              color: '#555555'
                            }}>
                            {task.taskType}
                          </span>
                        </div>

                        <p
                          className="text-base mb-2"
                          style={{ color: '#555555' }}>
                          {task.title}
                        </p>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" style={{ color: '#777777' }} />
                          <span
                            className="text-sm"
                            style={{ color: '#777777' }}>
                            {task.scheduledDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end md:justify-start">
                      <div
                        className="px-4 py-2 rounded-full flex items-center gap-2 font-medium text-sm"
                        style={{
                          background: statusBadge.bg,
                          color: statusBadge.color
                        }}>
                        {statusBadge.icon}
                        {task.status}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <div className="text-center py-20 animate-fade-up">
            <div
              className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background: '#f7f7f5' }}>
              <Calendar className="w-12 h-12" style={{ color: '#777777' }} />
            </div>
            <h3
              className="text-2xl font-serif mb-2"
              style={{ color: '#1a1a1a' }}>
              No study tasks yet
            </h3>
            <p
              className="mb-8"
              style={{ color: '#555555' }}>
              Your personalized study plan will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}