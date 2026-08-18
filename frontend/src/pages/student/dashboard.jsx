import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { recommendationService } from '../../services/recommendationService';
import SupportNeedBadge from '../../components/SupportNeedBadge';
import ExplanationModal from '../../components/ExplanationModal';
import { 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  BookOpen, 
  Coins, 
  Heart, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [todayData, setTodayData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeExplanation, setActiveExplanation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'STUDENT')) {
      router.push('/login');
      return;
    }

    if (user && user.role === 'STUDENT') {
      loadDashboard();
    }
  }, [user, authLoading]);

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const [todayRes, recsRes] = await Promise.all([
        studentService.getToday(),
        recommendationService.getRecommendations()
      ]);
      setTodayData(todayRes.today);
      setRecommendations(recsRes.recommendations || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenExplanation = async (recId) => {
    try {
      const data = await recommendationService.getExplanation(recId);
      setActiveExplanation(data);
      setModalOpen(true);
    } catch (err) {
      alert('Could not load explanation: ' + err.message);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <p>Loading your supportive dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header Greeting */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', padding: '4px 12px', borderRadius: '20px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>
          <Sparkles size={14} /> Student Well-being & Support Hub
        </div>
        <h1>Hello, {profile?.name || 'Student'} 👋</h1>
        <p style={{ fontSize: '1rem', marginTop: '4px' }}>How are you feeling today? Nivara is here to connect you with support before pressure builds up.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Today's Action Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)', borderColor: '#bbf7d0', marginBottom: '28px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <CheckCircle2 size={20} color={todayData?.checkInCompleted ? 'var(--success)' : '#64748b'} />
              <h3 style={{ fontSize: '1.1rem' }}>
                {todayData?.checkInCompleted ? "Today's Check-In Completed" : "Daily Check-In Pending"}
              </h3>
            </div>
            <p style={{ maxWidth: '600px' }}>
              {todayData?.checkInCompleted 
                ? "Thank you for checking in today. Your responses help match you with relevant academic, financial, and well-being resources."
                : "Take 30 seconds to log your mood, sleep, and stress. Nivara uses consented ratings to suggest helpful campus resources."}
            </p>
          </div>
          <div>
            {!todayData?.checkInCompleted ? (
              <button onClick={() => router.push('/student/checkin')} className="btn btn-primary">
                Complete Daily Check-In <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={() => router.push('/student/checkin')} className="btn btn-outline btn-sm">
                View Check-In History
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3D Support Need Indicators (Explicitly NOT a giant risk score) */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h2>My Support Need Indicators</h2>
            <p style={{ fontSize: '0.85rem' }}>Dynamic support levels based on your consented responses. These are purely supportive indicators, never permanent or punitive labels.</p>
          </div>
          <button onClick={() => router.push('/student/insights')} className="btn btn-sm btn-outline">
            Full Insights <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid-3">
          {/* Academic Indicator */}
          <div className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
            <div className="card-header">
              <div className="card-title">
                <BookOpen size={18} color="#3b82f6" /> Academic Support
              </div>
              <SupportNeedBadge level={todayData?.supportNeedSummary?.academic || 'LOW'} />
            </div>
            <p style={{ fontSize: '0.875rem', marginBottom: '14px' }}>
              Peer tutoring, faculty mentors, and study clinic resources.
            </p>
            <button onClick={() => router.push('/student/academic')} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
              Explore Academic Support
            </button>
          </div>

          {/* Financial Indicator */}
          <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
            <div className="card-header">
              <div className="card-title">
                <Coins size={18} color="#10b981" /> Financial Support
              </div>
              <SupportNeedBadge level={todayData?.supportNeedSummary?.financial || 'LOW'} />
            </div>
            <p style={{ fontSize: '0.875rem', marginBottom: '14px' }}>
              Tuition installments, scholarships, and emergency grants.
            </p>
            <button onClick={() => router.push('/student/financial')} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
              Explore Financial Support
            </button>
          </div>

          {/* Well-being Indicator */}
          <div className="card" style={{ borderLeft: '4px solid #ec4899' }}>
            <div className="card-header">
              <div className="card-title">
                <Heart size={18} color="#ec4899" /> Well-being Support
              </div>
              <SupportNeedBadge level={todayData?.supportNeedSummary?.wellbeing || 'LOW'} />
            </div>
            <p style={{ fontSize: '0.875rem', marginBottom: '14px' }}>
              Counsellor booking, peer support circles, and AI Support Space.
            </p>
            <button onClick={() => router.push('/student/support-space')} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
              Open Support Space
            </button>
          </div>
        </div>
      </div>

      {/* Active Recommendations with Explainability Trigger */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h2>Tailored Support Recommendations</h2>
            <p style={{ fontSize: '0.85rem' }}>Personalized opportunities generated from your consented responses.</p>
          </div>
          <span className="badge badge-neutral">{recommendations.length} Active Options</span>
        </div>

        {recommendations.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
            <ShieldCheck size={36} color="var(--success)" style={{ margin: '0 auto 10px auto' }} />
            <h3>No Active Support Alerts</h3>
            <p style={{ maxWidth: '480px', margin: '6px auto 0 auto' }}>Your self-reported signals and check-ins are currently balanced. Feel free to explore general campus resources anytime.</p>
          </div>
        ) : (
          <div className="grid-2">
            {recommendations.map((rec) => (
              <div key={rec._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span className="badge badge-mild">{rec.category}</span>
                  <button 
                    onClick={() => handleOpenExplanation(rec._id)} 
                    className="btn btn-sm btn-outline" 
                    style={{ fontSize: '0.75rem', padding: '3px 8px', color: 'var(--primary)' }}
                  >
                    <HelpCircle size={13} /> Why am I seeing this?
                  </button>
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>{rec.title}</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '14px' }}>{rec.explanationText}</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => {
                      if (rec.category === 'FINANCIAL') router.push('/student/financial');
                      else if (rec.category === 'ACADEMIC') router.push('/student/academic');
                      else router.push('/student/support-space');
                    }} 
                    className="btn btn-sm btn-primary"
                  >
                    Explore Opportunity <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Explanation Modal Component */}
      <ExplanationModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        explanationData={activeExplanation} 
      />
    </div>
  );
}
