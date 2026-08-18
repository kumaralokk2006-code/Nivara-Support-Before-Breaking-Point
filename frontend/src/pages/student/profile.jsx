import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { correctionService } from '../../services/correctionService';
import CorrectionModal from '../../components/CorrectionModal';
import { User, AlertCircle, CheckCircle2, FileEdit, Clock } from 'lucide-react';

export default function StudentProfilePage() {
  const { user, profile, refreshUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [language, setLanguage] = useState('English');
  const [communicationPreference, setCommunicationPreference] = useState('IN_APP');
  const [correctionRequests, setCorrectionRequests] = useState([]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState({});
  const [savedMsg, setSavedMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'STUDENT')) {
      router.push('/login');
      return;
    }
    if (profile) {
      setLanguage(profile.language || 'English');
      setCommunicationPreference(profile.communicationPreference || 'IN_APP');
      loadRequests();
    }
  }, [user, profile, authLoading]);

  const loadRequests = async () => {
    try {
      const res = await correctionService.getStudentRequests();
      setCorrectionRequests(res.requests || []);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg('');
    try {
      await studentService.updateProfile({ language, communicationPreference });
      await refreshUser();
      setSavedMsg('Preferences saved successfully.');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const openCorrection = (category, name, value) => {
    setSelectedField({ category, name, value });
    setModalOpen(true);
  };

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1>My Profile & Institutional Data</h1>
        <p>View your enrollment record and request verified corrections if any data is inaccurate.</p>
      </div>

      {savedMsg && <div className="alert alert-success">{savedMsg}</div>}

      {/* Institutional Details with Correction Buttons */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-header">
          <div className="card-title"><User size={18} color="var(--primary)" /> Institutional Enrollment Data</div>
          <span className="badge badge-neutral">Institutional Record</span>
        </div>

        <div className="grid-2" style={{ gap: '16px' }}>
          <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Full Name</span>
              <button onClick={() => openCorrection('PERSONAL', 'name', profile?.name)} className="btn btn-sm btn-outline" style={{ fontSize: '0.75rem', padding: '2px 6px' }}>
                <FileEdit size={12} /> Report Error
              </button>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '4px' }}>{profile?.name || 'Student'}</div>
          </div>

          <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered Email</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '4px' }}>{user?.email}</div>
          </div>

          <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Course & Year</span>
              <button onClick={() => openCorrection('ACADEMIC', 'course', profile?.course)} className="btn btn-sm btn-outline" style={{ fontSize: '0.75rem', padding: '2px 6px' }}>
                <FileEdit size={12} /> Report Error
              </button>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '4px' }}>{profile?.course} (Year {profile?.year})</div>
          </div>

          <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Department</span>
              <button onClick={() => openCorrection('ACADEMIC', 'department', profile?.department)} className="btn btn-sm btn-outline" style={{ fontSize: '0.75rem', padding: '2px 6px' }}>
                <FileEdit size={12} /> Report Error
              </button>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '4px' }}>{profile?.department}</div>
          </div>
        </div>
      </div>

      {/* Editable Preferences Form */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-header">
          <div className="card-title">Communication & Language Preferences</div>
        </div>
        <form onSubmit={handleSavePreferences}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Preferred Support Language</label>
              <select className="form-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Marathi">Marathi (मराठी)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Bengali">Bengali (বাংলা)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Notification Mode</label>
              <select className="form-select" value={communicationPreference} onChange={(e) => setCommunicationPreference(e.target.value)}>
                <option value="IN_APP">In-App Notifications Only</option>
                <option value="EMAIL">Email & In-App</option>
                <option value="NONE">Do Not Send Routine Alerts</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </form>
      </div>

      {/* Submitted Correction Requests Status */}
      {correctionRequests.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Clock size={18} color="var(--primary)" /> Submitted Data Correction Requests</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {correctionRequests.map((req) => (
              <div key={req._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-main)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Field: {req.fieldName} → Requested: "{req.requestedValue}"</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Reason: {req.justification}</div>
                </div>
                <span className={`badge ${req.status === 'APPROVED' ? 'badge-low' : req.status === 'REJECTED' ? 'badge-high' : 'badge-moderate'}`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <CorrectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultField={selectedField}
        onSuccess={loadRequests}
      />
    </div>
  );
}
