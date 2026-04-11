import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  BookOpen, 
  HelpCircle, 
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

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
  // Mock study plan data
   
  const [tasks] = useState<StudyTask[]>([
    {
      id: '1',
      subject: 'Mathematics',
      taskType: 'Review',
      title: 'Review derivatives and integration',
      scheduledDate: 'Tomorrow',
      status: 'Pending',
      color: '#3a6cf4'
    },
    {
      id: '2',
      subject: 'Physics',
      taskType: 'Quiz',
      title: 'Solve Thermodynamics quiz',
      scheduledDate: 'Today',
      status: 'Done',
      color: '#10b981'
    },
    {
      id: '3',
      subject: 'Chemistry',
      taskType: 'Summary',
      title: 'Read summary of Organic Chemistry',
      scheduledDate: 'Today',
      status: 'Pending',
      color: '#f59e0b'
    },
    {
      id: '4',
      subject: 'Biology',
      taskType: 'Review',
      title: 'Review Cell Biology chapter',
      scheduledDate: 'Yesterday',
      status: 'Missed',
      color: '#8b5cf6'
    },
    {
      id: '5',
      subject: 'History',
      taskType: 'Quiz',
      title: 'Complete World War II quiz',
      scheduledDate: 'Monday',
      status: 'Pending',
      color: '#ec4899'
    },
    {
      id: '6',
      subject: 'Mathematics',
      taskType: 'Quiz',
      title: 'Practice Linear Algebra problems',
      scheduledDate: 'Tuesday',
      status: 'Pending',
      color: '#3a6cf4'
    },
  ]);

  // AI Suggested Plan - Priority tasks
  const aiSuggestions = [
    'Review weak topics in Chemistry',
    'Complete pending quizzes',
    'Revise last mistakes'
  ];

  

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
            Study Plan
          </h1>
          <p 
            className="text-lg"
            style={{ color: '#555555' }}>
            Your personalized study schedule
          </p>
        </div>

        {/* AI Suggested Plan Section */}
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
            {aiSuggestions.map((suggestion, index) => (
              <div
                key={suggestion}
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
            ))}
          </div>
        </div>

        {/* Study Plan Cards */}
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
                  {/* Left Side - Subject + Task */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Subject Icon */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: task.color }}>
                      <div className="text-white">
                        {getTaskIcon(task.taskType)}
                      </div>
                    </div>

                    {/* Task Details */}
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

                  {/* Right Side - Status Badge */}
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

        {/* Empty State */}
        {tasks.length === 0 && (
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