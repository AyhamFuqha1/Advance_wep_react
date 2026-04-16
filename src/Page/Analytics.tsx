import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import Navbar from '../components/Navbar';
import { getAnalytics } from '../services/api';
import { 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  AlertCircle,
  BookOpen,
  Brain,
  RefreshCw,
  Sparkles,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface StatCard {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface SubjectProgress {
  subject: string;
  percentage: number;
  color: string;
}

interface PerformanceData {
  date: string;
  score: number;
}

interface Recommendation {
  icon: React.ReactNode;
  title: string;
  message: string;
}

interface AnalyticsResponse {
  stats: {
    success_rate: number;
    average_score: number;
    completed_quizzes: number;
    weak_topics: number;
  };
  subject_performance: {
    subject_id: number;
    subject_name?: string;
    subject_color?: string;
    score: number;
    success_rate: number;
  }[];
  progress_over_time: {
    date: string;
    score: number;
  }[];
  recommendations: {
    id: number;
    user_id: number;
    message: string;
    type: string;
    status: string;
    created_at: string;
    updated_at: string;
  }[];
  weak_areas: {
    id: number;
    user_id: number;
    subject_id: number;
    topic_name: string;
    weakness_level: string;
    times_mistaken: number;
    created_at: string;
    updated_at: string;
    subject?: {
      id: number;
      name: string;
      color: string;
    };
  }[];
}

export default function Analytics() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<StatCard[]>([]);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [todaysFocus, setTodaysFocus] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: AnalyticsResponse = await getAnalytics();

        setStats([
          {
            label: 'Success Rate',
            value: `${data.stats.success_rate}%`,
            icon: <TrendingUp className="w-6 h-6" />
          },
          {
            label: 'Average Score',
            value: data.stats.average_score.toFixed(2),
            icon: <Target className="w-6 h-6" />
          },
          {
            label: 'Completed Quizzes',
            value: String(data.stats.completed_quizzes),
            icon: <CheckCircle2 className="w-6 h-6" />
          },
          {
            label: 'Weak Topics',
            value: String(data.stats.weak_topics),
            icon: <AlertCircle className="w-6 h-6" />
          }
        ]);

        setSubjectProgress(
  data.subject_performance.map((item) => ({
    subject: item.subject_name || `Subject ${item.subject_id}`,
    percentage: item.success_rate,
    color: item.subject_color || '#8b5cf6'
  }))
);

        setPerformanceData(data.progress_over_time);

        setRecommendations(
          data.recommendations.map((rec) => ({
            icon: getRecommendationIcon(rec.type),
            title: formatRecommendationTitle(rec.type, rec.message),
            message: rec.message
          }))
        );

        setTodaysFocus(
          data.recommendations.slice(0, 3).map((rec) => rec.message)
        );
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setAnimateProgress(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

 

  

  const getRecommendationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'weak_area':
        return <BookOpen className="w-5 h-5" />;
      case 'review':
        return <Brain className="w-5 h-5" />;
      case 'quiz':
        return <RefreshCw className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const formatRecommendationTitle = (type: string, message: string) => {
    switch (type.toLowerCase()) {
      case 'weak_area':
        return 'Focus on Weak Areas';
      case 'review':
        return 'Review Important Topics';
      case 'quiz':
        return 'Practice More Quizzes';
      default:
        return message.length > 25 ? message.slice(0, 25) + '...' : message;
    }
  };

  const handleRecommendationClick = (title: string, message: string) => {
    const text = `${title} ${message}`.toLowerCase();

    if (text.includes('chemistry') || text.includes('organic')) {
      navigate('/subject/3');
    } else if (text.includes('calculus') || text.includes('math') || text.includes('integration')) {
      navigate('/subject/1');
    } else if (text.includes('physics') || text.includes('thermodynamics')) {
      navigate('/subject/2');
    }
  };

  const subjectPerformanceData = subjectProgress.map((sp) => ({
    subject: sp.subject,
    score: sp.percentage
  }));

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: '#ffffff' }}>
        <Navbar />
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-20">
          <div className="text-center py-20 animate-fade-up">
            <h3
              className="text-2xl font-serif mb-2"
              style={{ color: '#1a1a1a' }}
            >
              Loading analytics...
            </h3>
            <p style={{ color: '#555555' }}>
              Please wait while we fetch your performance data
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>
      <Navbar />
      
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-20">
        <div className="mb-12 animate-fade-up">
          <h1 
            className="font-serif mb-2"
            style={{ 
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: '#1a1a1a'
            }}>
            Analytics
          </h1>
          <p 
            className="text-lg"
            style={{ color: '#555555' }}>
            Track your performance and improve your study plan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl animate-fade-up"
              style={{
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                animationDelay: `${index * 0.1}s`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#555555';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e5e5';
              }}>
              
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: '#f7f7f5' }}>
                  <div style={{ color: '#555555' }}>
                    {stat.icon}
                  </div>
                </div>
              </div>

              <div 
                className="text-3xl font-bold mb-1"
                style={{ color: '#1a1a1a' }}>
                {stat.value}
              </div>

              <div 
                className="text-sm"
                style={{ color: '#777777' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div 
          className="mb-12 transition-all duration-300 animate-fade-up"
          style={{
            background: 'linear-gradient(135deg, #f7f7f5 0%, #ffffff 100%)',
            border: '1px solid #e5e5e5',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            animationDelay: '0.15s'
          }}>
          
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5" style={{ color: '#555555' }} />
            <h2 
              className="font-serif text-xl"
              style={{ color: '#1a1a1a' }}>
              Today's Focus
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {todaysFocus.map((task, index) => (
              <div
                key={task}
                className="flex items-center gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01]"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '12px',
                  padding: '16px',
                  animationDelay: `${0.2 + index * 0.05}s`
                }}>
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: '#f7f7f5' }}>
                  <ArrowRight className="w-4 h-4" style={{ color: '#555555' }} />
                </div>
                <p 
                  className="text-sm font-medium"
                  style={{ color: '#1a1a1a' }}>
                  {task}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div 
          className="mb-12 transition-all duration-300 animate-fade-up"
          style={{
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            animationDelay: '0.2s'
          }}>
          
          <h2 
            className="font-serif text-2xl mb-6"
            style={{ color: '#1a1a1a' }}>
            Subject Progress
          </h2>

          <div className="space-y-5">
            {subjectProgress.map((progress) => {
              const isWeak = progress.percentage < 60;
              
              return (
                <div key={progress.subject}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span 
                        className="font-medium"
                        style={{ color: '#1a1a1a' }}>
                        {progress.subject}
                      </span>
                      {isWeak && (
                        <AlertTriangle className="w-4 h-4" style={{ color: '#e67e22' }} />
                      )}
                    </div>
                    <span 
                      className="font-bold"
                      style={{ color: isWeak ? '#e67e22' : progress.color }}>
                      {progress.percentage}%
                    </span>
                  </div>
                  
                  <div 
                    className="w-full h-3 rounded-full overflow-hidden"
                    style={{ 
                      background: '#f0f0f0',
                      border: isWeak ? '1px solid rgba(230, 126, 34, 0.2)' : 'none'
                    }}>
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: animateProgress ? `${progress.percentage}%` : '0%',
                        background: isWeak ? '#e67e22' : progress.color
                      }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div 
            className="transition-all duration-300 animate-fade-up"
            style={{
              background: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              animationDelay: '0.4s'
            }}>
            
            <h2 
              className="font-serif text-xl mb-6"
              style={{ color: '#1a1a1a' }}>
              Progress Over Time
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#f0f0f0" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="date" 
                  stroke="#777777"
                  style={{ fontSize: '12px' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#777777"
                  style={{ fontSize: '12px' }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    color: '#1a1a1a'
                  }}
                  cursor={{ stroke: '#e5e5e5', strokeWidth: 1 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="rgba(68,68,68,0.7)" 
                  strokeWidth={3}
                  dot={{ fill: 'rgba(68,68,68,0.7)', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div 
            className="transition-all duration-300 animate-fade-up"
            style={{
              background: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              animationDelay: '0.5s'
            }}>
            
            <h2 
              className="font-serif text-xl mb-6"
              style={{ color: '#1a1a1a' }}>
              Subject Performance
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={subjectPerformanceData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#f0f0f0" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="subject" 
                  stroke="#777777"
                  style={{ fontSize: '11px' }}
                  tickLine={false}
                  axisLine={false}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#777777"
                  style={{ fontSize: '12px' }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    color: '#1a1a1a'
                  }}
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                />
                <Bar 
                  dataKey="score" 
                  fill="rgba(68,68,68,0.7)" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div 
          className="animate-fade-up"
          style={{
            animationDelay: '0.6s'
          }}>
          
          <h2 
            className="font-serif text-2xl mb-6"
            style={{ color: '#1a1a1a' }}>
            Recommendations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec, index) => (
              <div
                key={`${rec.title}-${index}`}
                className="transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl animate-fade-up cursor-pointer"
                style={{
                  background: '#f7f7f5',
                  border: '1px solid #e5e5e5',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  animationDelay: `${0.7 + index * 0.1}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#555555';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f7f7f5';
                  e.currentTarget.style.borderColor = '#e5e5e5';
                }}
                onClick={() => handleRecommendationClick(rec.title, rec.message)}>
                
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: '#ffffff' }}>
                    <div style={{ color: '#555555' }}>
                      {rec.icon}
                    </div>
                  </div>
                  <span 
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ 
                      background: '#e8f5e9', 
                      color: '#2e7d32'
                    }}>
                    Suggested
                  </span>
                </div>

                <h3 
                  className="font-bold text-base mb-2"
                  style={{ color: '#1a1a1a' }}>
                  {rec.title}
                </h3>

                <p 
                  className="text-sm mb-3"
                  style={{ color: '#777777' }}>
                  {rec.message}
                </p>

                <div className="flex items-center gap-1 text-xs font-medium" style={{ color: '#555555' }}>
                  <span>View details</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}