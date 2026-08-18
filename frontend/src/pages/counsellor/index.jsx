import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { counsellorService } from '../../services/counsellorService';
import { appointmentService } from '../../services/appointmentService';
import { Stethoscope, Calendar, Clock, CheckCircle2, XCircle, FileText, AlertCircle } from 'lucide-react';

export default function CounsellorDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Note Modal state
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [actionItems, setActionItems] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'COUNSELLOR')) {
      router.push('/login');
      return;
    }
    if (user) loadDashboard();
  }, [user, authLoading]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await counsellorService.getDashboard();
      setDashboard(res.dashboard || {});
    } catch (err) {
      setError(err.message || 'Failed to load counsellor dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (apptId, status) => {
    try {
      await appointmentService.updateStatus(apptId, status);
      loadDashboard();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!selectedAppt) return;
    setSavingNote(true);
    try {
      await counsellorService.saveSessionNote({
        appointmentId: selectedAppt._id,
        studentId: selectedAppt.studentId?._id || selectedAppt.studentId,
        content: noteContent,
        actionItems: actionItems.split(',').map(s => s.trim()).filter(Boolean),
        followUpRecommended: true
      });
      setNoteSuccess('Private session note saved securely.');
      setTimeout(() => {
        setSelectedAppt(null);
        setNoteSuccess('');
      }, 1500);
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingNote(false);
    }
  };

  if (authLoading || loading) return <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}><p>Loading Counsellor Desk...</p></div>;

  return (
    <div className="container">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', padding: '4px 12px', borderRadius: '20px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>
          <Stethoscope size={14} /> Campus Counselling Desk
        </div>
        <h1>Counsellor Dashboard</h1>
        <p>Manage student appointments, review pending requests, and record strictly confidential session notes.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Pending Session Requests */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-header">
          <div className="card-title"><Clock size={18} color="var(--primary)" /> Pending Student Session Requests</div>
          <span className="badge badge-moderate">{(dashboard?.pendingRequests || []).length} Pending</span>
        </div>

        {(dashboard?.pendingRequests || []).length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No pending appointment requests at this moment.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dashboard.pendingRequests.map((appt) => (
              <div key={appt._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Student: {appt.studentId?.email}</div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Requested: {new Date(appt.dateTime).toLocaleString()} • Modality: {appt.modality}
                  </div>
                  {appt.studentNotes && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '4px', fontStyle: 'italic' }}>
                      "{appt.studentNotes}"
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleUpdateStatus(appt._id, 'ACCEPTED')} className="btn btn-sm btn-primary">
                    <CheckCircle2 size={14} /> Accept
                  </button>
                  <button onClick={() => handleUpdateStatus(appt._id, 'REJECTED')} className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }}>
                    <XCircle size={14} /> Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Today's Scheduled Sessions */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-header">
          <div className="card-title"><Calendar size={18} color="var(--success)" /> Today's Scheduled Sessions</div>
          <span className="badge badge-low">{(dashboard?.todaySessions || []).length} Today</span>
        </div>

        {(dashboard?.todaySessions || []).length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No counselling sessions scheduled for today.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dashboard.todaySessions.map((appt) => (
              <div key={appt._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Student: {appt.studentId?.email}</div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Time: {new Date(appt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Modality: {appt.modality}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { setSelectedAppt(appt); setNoteContent(''); setActionItems(''); }} className="btn btn-sm btn-outline">
                    <FileText size={14} /> Session Note
                  </button>
                  <button onClick={() => handleUpdateStatus(appt._id, 'COMPLETED')} className="btn btn-sm btn-primary">
                    Mark Completed
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Private Session Note Modal */}
      {selectedAppt && (
        <div className="modal-overlay" onClick={() => setSelectedAppt(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem' }}>Confidential Session Note</h3>
            </div>
            {noteSuccess ? (
              <div className="modal-body" style={{ textAlign: 'center', padding: '30px' }}>
                <CheckCircle2 size={40} color="var(--success)" style={{ margin: '0 auto 12px auto' }} />
                <h3>{noteSuccess}</h3>
              </div>
            ) : (
              <form onSubmit={handleSaveNote}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Clinical / Counselling Observations (Strictly Private)</label>
                    <textarea 
                      className="form-textarea" 
                      rows={4} 
                      value={noteContent} 
                      onChange={(e) => setNoteContent(e.target.value)} 
                      placeholder="Enter session summary, coping strategies discussed, and student progress..." 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Action Items (comma separated)</label>
                    <input 
                      className="form-input" 
                      type="text" 
                      value={actionItems} 
                      onChange={(e) => setActionItems(e.target.value)} 
                      placeholder="e.g. Schedule sleep hygiene routine, Meet peer tutor" 
                    />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Session notes are protected with strict role-based access control and are never accessible to institutional administrators or peers.
                  </p>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setSelectedAppt(null)} className="btn btn-outline btn-sm">Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={savingNote}>
                    {savingNote ? 'Saving...' : 'Save Encrypted Note'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
