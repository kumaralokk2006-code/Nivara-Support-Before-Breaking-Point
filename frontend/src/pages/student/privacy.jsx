import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { consentService } from '../../services/consentService';
import { studentService } from '../../services/studentService';
import { ShieldCheck, Lock, Eye, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function ConsentCenter() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [consents, setConsents] = useState([]);
  const [transparency, setTransparency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'STUDENT')) {
      router.push('/login');
      return;
    }
    if (user) loadData();
  }, [user, authLoading]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [consentRes, transRes] = await Promise.all([
        consentService.getConsents(),
        studentService.getTransparencyReport()
      ]);
      setConsents(consentRes.consents || []);
      setTransparency(transRes.report || null);
    } catch (err) {
      setError(err.message || 'Failed to load consent settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleConsent = async (consentType, currentStatus) => {
    setUpdating(consentType);
    setMessage('');
    setError('');
    try {
      if (currentStatus) {
        // Revoke
        await consentService.revokeConsent(consentType);
        setMessage(`Consent for '${consentType}' was revoked. This data will not be used in future support evaluations.`);
      } else {
        // Grant
        await consentService.updateConsent(consentType, true);
        setMessage(`Consent for '${consentType}' has been granted.`);
      }
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to update consent.');
    } finally {
      setUpdating(null);
    }
  };

  const getConsentStatus = (type) => {
    const item = consents.find(c => c.consentType === type);
    return item?.granted || false;
  };

  if (authLoading || loading) {
    return <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}><p>Loading Consent Center...</p></div>;
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--success-light)', padding: '4px 12px', borderRadius: '20px', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>
          <ShieldCheck size={14} /> Informed Consent & Transparency
        </div>
        <h1>My Data & Privacy Settings</h1>
        <p>You have full agency over your data. Nivara only uses information you have explicitly consented to, and withdrawal immediately halts its use.</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Consent Gating Toggles */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-header">
          <div className="card-title">
            <Lock size={18} color="var(--primary)" /> Granular Data Permissions
          </div>
          <button onClick={loadData} className="btn btn-sm btn-outline"><RefreshCw size={13} /> Refresh</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Wellbeing Check-in Consent */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Daily Well-being Check-ins</div>
              <p style={{ fontSize: '0.825rem', marginTop: '2px' }}>Allows recording self-reported daily mood, stress, and sleep scores for trend reflections.</p>
            </div>
            <button 
              onClick={() => handleToggleConsent('wellbeing_checkin', getConsentStatus('wellbeing_checkin'))}
              disabled={updating === 'wellbeing_checkin'}
              className={`btn btn-sm ${getConsentStatus('wellbeing_checkin') ? 'btn-primary' : 'btn-outline'}`}
            >
              {getConsentStatus('wellbeing_checkin') ? '✓ Permission Granted' : 'Opt In / Allow'}
            </button>
          </div>

          {/* Financial Matching Consent */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Financial Support Matching</div>
              <p style={{ fontSize: '0.825rem', marginTop: '2px' }}>Allows answering minimal fee difficulty questions to surface relevant scholarships and installment plans.</p>
            </div>
            <button 
              onClick={() => handleToggleConsent('financial_matching', getConsentStatus('financial_matching'))}
              disabled={updating === 'financial_matching'}
              className={`btn btn-sm ${getConsentStatus('financial_matching') ? 'btn-primary' : 'btn-outline'}`}
            >
              {getConsentStatus('financial_matching') ? '✓ Permission Granted' : 'Opt In / Allow'}
            </button>
          </div>

          {/* Academic Integration Consent */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Academic Data & Signal Integration</div>
              <p style={{ fontSize: '0.825rem', marginTop: '2px' }}>Allows self-reporting subject difficulties and exam pressure for peer tutoring and advisor pairing.</p>
            </div>
            <button 
              onClick={() => handleToggleConsent('academic_integration', getConsentStatus('academic_integration'))}
              disabled={updating === 'academic_integration'}
              className={`btn btn-sm ${getConsentStatus('academic_integration') ? 'btn-primary' : 'btn-outline'}`}
            >
              {getConsentStatus('academic_integration') ? '✓ Permission Granted' : 'Opt In / Allow'}
            </button>
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '20px', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          <strong>Notice on Revocation:</strong> Withdrawing consent stops that category of data from being used in future support evaluations immediately.
        </div>
      </div>

      {/* Data Transparency Audit View */}
      {transparency && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Eye size={18} color="var(--primary)" /> What Nivara Stores & Who Has Access
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {transparency.dataFieldsStored?.map((item, idx) => (
              <div key={idx} style={{ padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.category}</span>
                  {item.isOptional ? <span className="badge badge-mild">Optional (Consented)</span> : <span className="badge badge-neutral">Core Enrollment</span>}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                  <strong>Fields:</strong> {item.fields.join(', ')}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <strong>Purpose:</strong> {item.purpose}
                </div>
                {item.accessTier && (
                  <div style={{ fontSize: '0.8rem', color: '#1e40af', marginTop: '2px' }}>
                    <strong>Access Tier:</strong> {item.accessTier}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
