import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { supportNeedService } from '../../services/supportNeedService';
import SupportNeedBadge from '../../components/SupportNeedBadge';
import { LineChart, BookOpen, Coins, Heart, ShieldCheck, RefreshCw } from 'lucide-react';

export default function SupportInsights() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [insights, setInsights] = useState(null);
  const [supportNeed, setSupportNeed] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'STUDENT')) {
      router.push('/login');
      return;
    }
    if (user) loadInsights();
  }, [user, authLoading]);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const [insRes, needRes] = await Promise.all([
        studentService.getInsights(),
        supportNeedService.getStudentSupportNeed()
      ]);
      setInsights(insRes.insights || {});
      setSupportNeed(needRes.supportNeedProfile || {});
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) return <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}><p>Loading Insights...</p></div>;

  return (
    <div className="container">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', padding: '4px 12px', borderRadius: '20px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>
          <LineChart size={14} /> My Support Need Profile
        </div>
        <h1>Support Needs & Well-being Trends</h1>
        <p>A multi-dimensional breakdown of your support indicators across Academic, Financial, and Well-being domains.</p>
      </div>

      {/* 3D Need Dimensions */}
      <div className="grid-3" style={{ marginBottom: '28px' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title"><BookOpen size={18} color="var(--primary)" /> Academic Support Need</div>
            <SupportNeedBadge level={supportNeed?.academicNeed || 'LOW'} />
          </div>
          <p style={{ fontSize: '0.875rem' }}>Calculated from attendance trends, subject challenges, and exam pressure.</p>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title"><Coins size={18} color="var(--success)" /> Financial Support Need</div>
            <SupportNeedBadge level={supportNeed?.financialNeed || 'LOW'} />
          </div>
          <p style={{ fontSize: '0.875rem' }}>Calculated from self-reported fee difficulty and active aid status.</p>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title"><Heart size={18} color="var(--danger)" /> Well-being Support Need</div>
            <SupportNeedBadge level={supportNeed?.wellbeingNeed || 'LOW'} />
          </div>
          <p style={{ fontSize: '0.875rem' }}>Calculated from rolling 14-day check-in stress, sleep, and mood ratings.</p>
        </div>
      </div>

      {/* 30-Day Check-in Averages */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-header">
          <div className="card-title"><LineChart size={18} color="var(--primary)" /> 30-Day Reflection Averages</div>
          <span className="badge badge-neutral">{insights?.totalCheckIns || 0} Total Check-Ins</span>
        </div>

        <div className="grid-4" style={{ textAlign: 'center' }}>
          <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{insights?.averages?.mood || 0}/5</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Mood</div>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger)' }}>{insights?.averages?.stress || 0}/5</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Stress</div>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#8b5cf6' }}>{insights?.averages?.sleep || 0}/5</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Sleep</div>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0d9488' }}>{insights?.averages?.academicPressure || 0}/5</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Academic Pressure</div>
          </div>
        </div>
      </div>

      {/* Non-punitive assurance alert */}
      <div className="alert alert-success">
        <ShieldCheck size={20} style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.875rem' }}>
          <strong>System-Level Safeguard:</strong> {supportNeed?.nonPunitiveAssurance || 'These indicators represent supportive resource recommendations and cannot be used for punitive, grading, or disciplinary actions.'}
        </div>
      </div>
    </div>
  );
}
