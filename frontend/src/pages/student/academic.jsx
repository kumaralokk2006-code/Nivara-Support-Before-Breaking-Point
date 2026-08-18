import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { academicService } from '../../services/academicService';
import { recommendationService } from '../../services/recommendationService';
import ConsentWarning from '../../components/ConsentWarning';
import ExplanationModal from '../../components/ExplanationModal';
import { BookOpen, Users, HelpCircle, ArrowRight, CheckCircle2, GraduationCap } from 'lucide-react';

export default function AcademicSupportNavigator() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [hasConsent, setHasConsent] = useState(true);
  const [signals, setSignals] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeExplanation, setActiveExplanation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'STUDENT')) {
      router.push('/login');
      return;
    }
    if (user) loadAcademicData();
  }, [user, authLoading]);

  const loadAcademicData = async () => {
    setLoading(true);
    try {
      const [sigRes, progRes, recRes] = await Promise.all([
        academicService.getSignals(),
        academicService.getPrograms(),
        academicService.getRecommendations()
      ]);
      setSignals(sigRes.signal || {});
      setPrograms(progRes.programs || []);
      setRecommendations(recRes.recommendations || []);
    } catch (err) {
      if (err.data?.consentRequired) {
        setHasConsent(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenExplanation = async (recId) => {
    try {
      const data = await recommendationService.getExplanation(recId);
      setActiveExplanation(data);
      setModalOpen(true);
    } catch (e) {
      alert(e.message);
    }
  };

  if (!hasConsent) {
    return (
      <div className="container" style={{ maxWidth: '800px' }}>
        <ConsentWarning consentType="academic_integration" title="Academic Integration Consent Required" />
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', padding: '4px 12px', borderRadius: '20px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>
          <GraduationCap size={14} /> Academic Support Navigator
        </div>
        <h1>Academic Resources & Advising</h1>
        <p>Explore peer tutoring clinics, faculty mentors, time-management resources, and exam prep workshops.</p>
      </div>

      {/* Consented Academic Signals Snapshot */}
      <div className="card" style={{ marginBottom: '28px', background: '#f8fafc' }}>
        <div className="card-header">
          <div className="card-title">
            <BookOpen size={18} color="var(--primary)" /> Consented Academic Context
          </div>
          <span className="badge badge-mild">Student Agency Enabled</span>
        </div>
        <div className="grid-3" style={{ fontSize: '0.875rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Attendance Trajectory:</span>
            <div style={{ fontWeight: 700, marginTop: '2px' }}>{signals?.attendanceTrend || 'STABLE'} ({signals?.attendancePercentage || 85}%)</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Assessment Trend:</span>
            <div style={{ fontWeight: 700, marginTop: '2px' }}>{signals?.marksTrend || 'STABLE'}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Reported Challenging Subjects:</span>
            <div style={{ fontWeight: 700, marginTop: '2px' }}>{(signals?.subjectDifficulty || []).join(', ') || 'None reported'}</div>
          </div>
        </div>
      </div>

      {/* Matched Academic Programs */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '14px' }}>Matched Academic Programs</h2>
        <div className="grid-2">
          {programs.map((prog) => (
            <div key={prog._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge badge-mild">{prog.subCategory.replace(/_/g, ' ')}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prog.providerDepartment}</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{prog.title}</h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '16px' }}>{prog.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Campus Supported</span>
                <button onClick={() => alert('Connected with ' + prog.providerDepartment + ' for ' + prog.title)} className="btn btn-sm btn-primary">
                  Connect With Support <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ExplanationModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        explanationData={activeExplanation} 
      />
    </div>
  );
}
