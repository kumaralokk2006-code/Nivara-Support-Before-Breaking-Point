import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { correctionService } from '../services/correctionService';

const CorrectionModal = ({ isOpen, onClose, defaultField = {}, onSuccess }) => {
  const [fieldCategory, setFieldCategory] = useState(defaultField.category || 'ACADEMIC');
  const [fieldName, setFieldName] = useState(defaultField.name || 'attendance');
  const [currentValue, setCurrentValue] = useState(defaultField.value || '');
  const [requestedValue, setRequestedValue] = useState('');
  const [justification, setJustification] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requestedValue.trim() || !justification.trim()) {
      setError('Please provide the corrected value and a justification.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await correctionService.submitRequest({
        fieldCategory,
        fieldName,
        currentValue,
        requestedValue,
        justification
      });
      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      setError(err.message || 'Failed to submit correction request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.1rem' }}>Report Incorrect Information</h3>
          <button onClick={onClose} className="btn btn-sm btn-outline" style={{ padding: '4px 8px' }}>
            <X size={16} />
          </button>
        </div>

        {success ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 16px auto' }} />
            <h3>Correction Request Submitted</h3>
            <p style={{ marginTop: '8px' }}>Your request has been routed to institutional administrators for review. An audit log entry was created.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={fieldCategory} onChange={(e) => setFieldCategory(e.target.value)}>
                  <option value="ACADEMIC">Academic (Attendance / Courses)</option>
                  <option value="PERSONAL">Personal (Name / Contact)</option>
                  <option value="ENROLLMENT">Enrollment Details</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Field Name</label>
                <input className="form-input" type="text" value={fieldName} onChange={(e) => setFieldName(e.target.value)} required />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Current Stored Value</label>
                  <input className="form-input" type="text" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Requested Correct Value *</label>
                  <input className="form-input" type="text" value={requestedValue} onChange={(e) => setRequestedValue(e.target.value)} placeholder="e.g. 85%" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Reason / Justification *</label>
                <textarea className="form-textarea" rows={3} value={justification} onChange={(e) => setJustification(e.target.value)} placeholder="Explain the discrepancy (e.g. Medical leave approved by department on 12th Aug)" required />
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Nivara maintains an immutable audit log for all institutional data corrections to ensure transparency and accuracy.
              </p>
            </div>

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn btn-outline btn-sm">Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Correction Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CorrectionModal;
