import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import Navbar from '../components/Navbar';
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

export default function Analytics() {
  const navigate = useNavigate();
  

  // Mock stats data
  const stats: StatCard[] = [
    {
      label: 'Success Rate',
      value: '78%',
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      label: 'Average Score',
      value: '82',
      icon: <Target className="w-6 h-6" />
    },
    {
      label: 'Completed Quizzes',
      value: '24',
      icon: <CheckCircle2 className="w-6 h-6" />
    },
    {
      label: 'Weak Topics',
      value: '3',
      icon: <AlertCircle className="w-6 h-6" />
    }
  ];

  // Mock subject progress data
  const subjectProgress: SubjectProgress[] = [
    { subject: 'Mathematics', percentage: 80, color: '#3a6cf4' },
    { subject: 'Physics', percentage: 65, color: '#10b981' },
    { subject: 'Chemistry', percentage: 50, color: '#f59e0b' },
    { subject: 'Biology', percentage: 72, color: '#8b5cf6' },
    { subject: 'History', percentage: 85, color: '#ec4899' },
  ];

  // Mock performance over time data
  const performanceData: PerformanceData[] = [
    { date: 'Week 1', score: 65 },
    { date: 'Week 2', score: 72 },
    { date: 'Week 3', score: 68 },
    { date: 'Week 4', score: 78 },
    { date: 'Week 5', score: 82 },
    { date: 'Week 6', score: 85 },
  ];

  // Mock subject performance data for bar chart
  const subjectPerformanceData = subjectProgress.map(sp => ({
    subject: sp.subject,
    score: sp.percentage
  }));

  // Mock recommendations
  const recommendations: Recommendation[] = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: 'Focus on Chemistry',
      message: 'You have weak performance in Organic Chemistry topics'
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: 'Review Calculus',
      message: 'Revisit derivatives and integration concepts'
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: 'Retake Physics Quiz',
      message: 'Improve your understanding of Thermodynamics'
    }
  ];

  // Today's Focus - AI priorities
  const todaysFocus = [
    'Review Calculus derivatives',
    'Retake Physics Quiz',
    'Focus on Organic Chemistry'
  ];

  // State for progress bar animations
  const [animateProgress, setAnimateProgress] = useState(false);

  

  // Trigger progress bar animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateProgress(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleRecommendationClick = (title: string) => {
    // Simulate navigation based on recommendation
    if (title.includes('Chemistry')) {
      navigate('/subject/3');
    } else if (title.includes('Calculus') || title.includes('Math')) {
      navigate('/subject/1');
    } else if (title.includes('Physics')) {
      navigate('/subject/2');
    }
  };



  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>
      <Navbar />
      
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-20">
        {/* Header */}
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

        {/* Stats Cards */}
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

        {/* Today's Focus Section - AI Priorities */}
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

        {/* Performance Progress Section */}
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Line Chart - Progress Over Time */}
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

          {/* Bar Chart - Subject Performance */}
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

        {/* Recommendations Section */}
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
                key={rec.title}
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
                onClick={() => handleRecommendationClick(rec.title)}>
                
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