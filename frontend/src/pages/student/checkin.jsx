import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { checkinService } from '../../services/checkinService';
import { consentService } from '../../services/consentService';
import ConsentWarning from '../../components/ConsentWarning';
import { CheckCircle2, Heart, Moon, Flame, Brain, Sparkles, History, Smile } from 'lucide-react';

export default function DailyCheckIn() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [hasConsent, setHasConsent] = useState(true);
  const [mood, setMood] = useState(3);
  const [stress, setStress] = useState(2);
  const [sleep, setSleep] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [academicPressure, setAcademicPressure] = useState(2);
  const [notes, setNotes] = useState('');

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'STUDENT')) {
      router.push('/login');
      return;
    }
    if (user) {
      checkConsentAndHistory();
    }
  }, [user, authLoading]);

  const checkConsentAndHistory = async () => {
    try {
      const consentRes = await consentService.getConsents();
      const wellbeingConsent = consentRes.consents?.find(c => c.consentType === 'wellbeing_checkin');
      setHasConsent(!!wellbeingConsent?.granted);

      const histRes = await checkinService.getHistory(7);
      setHistory(histRes.history || []);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await checkinService.submitCheckIn({
        mood: Number(mood),
        stress: Number(stress),
        sleep: Number(sleep),
        energy: Number(energy),
        academicPressure: Number(academicPressure),
        notes
      });
      setSuccessMsg(res.message || 'Check-in recorded successfully!');
      checkConsentAndHistory();
    } catch (err) {
      if (err.data?.consentRequired) {
        setHasConsent(false);
      }
      setError(err.message || 'Failed to submit check-in.');
    } finally {
      setLoading(false);
    }
  };

  if (!hasConsent) {
    return (
      <div className="container" style={{ maxWidth: '800px' }}>
        <ConsentWarning consentType="wellbeing_checkin" title="Well-being Check-in Consent Required" />
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', padding: '4px 12px', borderRadius: '20px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>
          <Smile size={14} /> Daily Self-Reflection
        </div>
        <h1>Daily Well-being Check-In</h1>
        <p>Log your daily mood, sleep, and pressure on a 1–5 scale. This creates self-awareness and helps connect you to supportive resources.</p>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card" style={{ marginBottom: '28px' }}>
        <form onSubmit={handleSubmit}>
          
          {/* Mood Slider */}
          <div className="rating-slider-container">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Smile size={16} color="var(--primary)" /> Overall Mood: <strong>{mood}/5</strong>
              </label>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{mood === 1 ? 'Very Low' : mood === 5 ? 'Excellent' : 'Moderate'}</span>
            </div>
            <input type="range" min="1" max="5" value={mood} onChange={(e) => setMood(e.target.value)} className="rating-slider" />
            <div className="rating-ticks">
              <span>1 - Struggling</span>
              <span>2 - Low</span>
              <span>3 - Neutral</span>
              <span>4 - Good</span>
              <span>5 - Great</span>
            </div>
          </div>

          {/* Stress Slider */}
          <div className="rating-slider-container" style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={16} color="var(--danger)" /> Stress Level: <strong>{stress}/5</strong>
              </label>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stress >= 4 ? 'Elevated' : 'Manageable'}</span>
            </div>
            <input type="range" min="1" max="5" value={stress} onChange={(e) => setStress(e.target.value)} className="rating-slider" />
            <div className="rating-ticks">
              <span>1 - Minimal</span>
              <span>2 - Mild</span>
              <span>3 - Moderate</span>
              <span>4 - High</span>
              <span>5 - Overwhelming</span>
            </div>
          </div>

          {/* Sleep Slider */}
          <div className="rating-slider-container" style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Moon size={16} color="#8b5cf6" /> Sleep Restfulness: <strong>{sleep}/5</strong>
              </label>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sleep <= 2 ? 'Restless' : 'Restful'}</span>
            </div>
            <input type="range" min="1" max="5" value={sleep} onChange={(e) => setSleep(e.target.value)} className="rating-slider" />
            <div className="rating-ticks">
              <span>1 - Very Poor</span>
              <span>2 - Disrupted</span>
              <span>3 - Adequate</span>
              <span>4 - Good</span>
              <span>5 - Deep Rest</span>
            </div>
          </div>

          {/* Academic Pressure Slider */}
          <div className="rating-slider-container" style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Brain size={16} color="#0d9488" /> Academic / Coursework Pressure: <strong>{academicPressure}/5</strong>
              </label>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{academicPressure >= 4 ? 'Intense' : 'Manageable'}</span>
            </div>
            <input type="range" min="1" max="5" value={academicPressure} onChange={(e) => setAcademicPressure(e.target.value)} className="rating-slider" />
            <div className="rating-ticks">
              <span>1 - None</span>
              <span>2 - Light</span>
              <span>3 - Moderate</span>
              <span>4 - Heavy</span>
              <span>5 - Urgent Backlog</span>
            </div>
          </div>

          {/* Optional Note */}
          <div className="form-group" style={{ marginTop: '22px' }}>
            <label className="form-label">Personal Reflection (Optional, max 300 chars)</label>
            <textarea 
              className="form-textarea" 
              rows={2} 
              maxLength={300}
              placeholder="e.g. Feeling better after yesterday's study group, but a bit anxious about the upcoming lab quiz..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Submitting Check-In...' : 'Record Daily Check-In'}
          </button>
        </form>
      </div>

      {/* Past 7 Check-in History */}
      {history.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <History size={18} color="var(--primary)" /> Recent Check-In History
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.map((h) => (
              <div key={h._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-main)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{h.dateString}</span>
                <div style={{ display: 'flex', gap: '14px', fontSize: '0.8rem' }}>
                  <span>Mood: <strong>{h.mood}/5</strong></span>
                  <span>Stress: <strong>{h.stress}/5</strong></span>
                  <span>Sleep: <strong>{h.sleep}/5</strong></span>
                  <span>Pressure: <strong>{h.academicPressure}/5</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
