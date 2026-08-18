import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { financialService } from '../../services/financialService';
import ConsentWarning from '../../components/ConsentWarning';
import { Coins, CheckCircle2, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';

export default function FinancialSupportNavigator() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [hasConsent, setHasConsent] = useState(true);
  const [feeDifficulty, setFeeDifficulty] = useState('NONE');
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [currentAidStatus, setCurrentAidStatus] = useState('NOT_RECEIVING');
  const [programs, setPrograms] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'STUDENT')) {
      router.push('/login');
      return;
    }
    if (user) loadFinancialData();
  }, [user, authLoading]);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      const [profRes, progRes, recRes] = await Promise.all([
        financialService.getProfile(),
        financialService.getPrograms(),
        financialService.getRecommendations()
      ]);

      if (profRes.financialProfile) {
        setFeeDifficulty(profRes.financialProfile.feeDifficulty || 'NONE');
        setExpenseCategories(profRes.financialProfile.expenseCategories || []);
        setCurrentAidStatus(profRes.financialProfile.currentAidStatus || 'NOT_RECEIVING');
      }
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

  const handleToggleExpense = (cat) => {
    if (expenseCategories.includes(cat)) {
      setExpenseCategories(expenseCategories.filter(c => c !== cat));
    } else {
      setExpenseCategories([...expenseCategories, cat]);
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setError('');
    try {
      await financialService.updateProfile({
        feeDifficulty,
        expenseCategories,
        currentAidStatus
      });
      setSuccessMsg('Financial support preferences updated. Support options refreshed below.');
      loadFinancialData();
    } catch (err) {
      setError(err.message || 'Failed to update financial profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!hasConsent) {
    return (
      <div className="container" style={{ maxWidth: '800px' }}>
        <ConsentWarning consentType="financial_matching" title="Financial Support Matching Consent Required" />
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', padding: '4px 12px', borderRadius: '20px', color: '#059669', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>
          <Coins size={14} /> Minimal-Data Support Navigator
        </div>
        <h1>Financial Support Navigator</h1>
        <p>Nivara collects only minimal, non-judgmental information to surface relevant campus schemes and scholarships. No bank statements or credit scores are ever required.</p>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* 3-Question Minimal Input Form */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-header">
          <div className="card-title">
            <Coins size={18} color="var(--primary)" /> Minimal Financial Support Check
          </div>
          <span className="badge badge-low">No Bank Data Required</span>
        </div>

        <form onSubmit={handleSavePreferences}>
          <div className="grid-2">
            {/* Question 1: Fee Difficulty */}
            <div className="form-group">
              <label className="form-label">1. Difficulty with Educational Expenses</label>
              <select className="form-select" value={feeDifficulty} onChange={(e) => setFeeDifficulty(e.target.value)}>
                <option value="NONE">No difficulty</option>
                <option value="SLIGHT">Slight difficulty</option>
                <option value="MODERATE">Moderate difficulty</option>
                <option value="SIGNIFICANT">Significant difficulty</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>

            {/* Question 3: Current Aid Status */}
            <div className="form-group">
              <label className="form-label">2. Current Financial Aid Status</label>
              <select className="form-select" value={currentAidStatus} onChange={(e) => setCurrentAidStatus(e.target.value)}>
                <option value="NOT_RECEIVING">Not currently receiving aid</option>
                <option value="RECEIVING">Currently receiving institutional/govt aid</option>
                <option value="APPLIED_WAITING">Applied and waiting for decision</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Question 2: Target Expense Categories */}
          <div className="form-group">
            <label className="form-label">3. Expense Categories where assistance would be helpful:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
              {['TUITION', 'HOSTEL', 'FOOD', 'BOOKS', 'TRANSPORT', 'EXAM_FEES'].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleToggleExpense(cat)}
                  className={`btn btn-sm ${expenseCategories.includes(cat) ? 'btn-primary' : 'btn-outline'}`}
                >
                  {expenseCategories.includes(cat) ? '✓ ' : '+ '}{cat.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Updating Options...' : 'Update Financial Preferences'}
          </button>
        </form>
      </div>

      {/* Available Support Schemes with Non-Definitive Phrasing */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h2>Available Support Opportunities</h2>
            <p style={{ fontSize: '0.85rem' }}>Options matching your consented criteria. Final eligibility is determined by the granting institution.</p>
          </div>
        </div>

        <div className="grid-2">
          {programs.map((prog) => (
            <div key={prog._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge badge-low">{prog.subCategory.replace(/_/g, ' ')}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prog.providerDepartment}</span>
              </div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>{prog.title}</h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '14px' }}>{prog.description}</p>
              
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#475569', marginBottom: '14px' }}>
                <em>"You may want to explore this support option. Application details are managed by {prog.providerDepartment}."</em>
              </div>

              <button onClick={() => alert('Navigating to institutional application guidelines for ' + prog.title)} className="btn btn-sm btn-outline" style={{ width: '100%' }}>
                View Institutional Details <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
