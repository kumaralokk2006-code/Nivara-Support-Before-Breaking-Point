import React from 'react';
import { X, HelpCircle, ShieldCheck, Clock, AlertCircle } from 'lucide-react';

const ExplanationModal = ({ isOpen, onClose, explanationData }) => {
  if (!isOpen || !explanationData) return null;

  const { programTitle, category, explanation } = explanationData;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--primary-light)', padding: '6px', borderRadius: '8px', color: 'var(--primary)' }}>
              <HelpCircle size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Why am I seeing this?</h3>
              <p style={{ fontSize: '0.8rem' }}>{programTitle || 'Support Recommendation'}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-outline" style={{ padding: '4px 8px' }}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Summary */}
          <div style={{ background: 'var(--primary-light)', border: '1px solid var(--primary-border)', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '18px' }}>
            <p style={{ color: '#1e3a8a', fontWeight: 600, fontSize: '0.9rem' }}>
              {explanation?.summary || 'Matched based on your consented support preferences and check-ins.'}
            </p>
          </div>

          {/* Contributing Factors */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: '#334155' }}>Contributing Consented Responses:</h4>
            <ul style={{ paddingLeft: '20px', fontSize: '0.875rem', color: 'var(--text-main)' }}>
              {(explanation?.contributingFactors || []).map((factor, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>{factor}</li>
              ))}
            </ul>
          </div>

          {/* Time Window */}
          {explanation?.timeWindow && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              <Clock size={15} color="var(--primary)" />
              <span>{explanation.timeWindow}</span>
            </div>
          )}

          {/* Data Not Used */}
          {explanation?.dataNotUsed && (
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '18px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Data Strictly Excluded / NOT Used:
              </div>
              <ul style={{ paddingLeft: '18px', fontSize: '0.8rem', color: '#64748b' }}>
                {explanation.dataNotUsed.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Non-punitive guarantee */}
          <div className="alert alert-success" style={{ margin: 0 }}>
            <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.825rem' }}>
              <strong>Non-Punitive Assurance:</strong> {explanation?.nonPunitiveAssurance || 'This recommendation is solely for support navigation. It does not affect your grades, scholarship standing, attendance penalties, or disciplinary record.'}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Got it, thanks
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplanationModal;
