import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { correctionService } from '../../services/correctionService';
import { BarChart3, Scale, ShieldCheck, Users, CheckCircle2, XCircle, RefreshCw, FileText } from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [metrics, setMetrics] = useState(null);
  const [fairness, setFairness] = useState([]);
  const [correctionRequests, setCorrectionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }
    if (user) loadAdminData();
  }, [user, authLoading]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [dashRes, fairRes, reqRes] = await Promise.all([
        adminService.getDashboard(),
        adminService.getFairnessAudit(),
        correctionService.getAllAdminRequests()
      ]);
      setMetrics(dashRes.metrics || {});
      setFairness(fairRes.metrics || []);
      setCorrectionRequests(reqRes.requests || []);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunFairnessAudit = async () => {
    setAuditing(true);
    try {
      const res = await adminService.triggerFairnessAudit('department');
      setFairness(res.metrics || []);
      alert('Group-level fairness and bias audit recomputed.');
    } catch (e) {
      alert(e.message);
    } finally {
      setAuditing(false);
    }
  };

  const handleReviewCorrection = async (id, status) => {
    try {
      await correctionService.reviewRequest(id, status, 'Approved by campus institutional administrator');
      loadAdminData();
    } catch (e) {
      alert(e.message);
    }
  };

  if (authLoading || loading) return <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}><p>Loading Campus Admin...</p></div>;

  return (
    <div className="container">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', padding: '4px 12px', borderRadius: '20px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>
          <BarChart3 size={14} /> Campus Support & Fairness Administration
        </div>
        <h1>Campus Support Overview</h1>
        <p>Monitor aggregated support demand and audit system-wide fairness without punitive student surveillance.</p>
      </div>

      {/* Aggregate Demand Cards */}
      <div className="grid-3" style={{ marginBottom: '28px' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Enrolled Students</div>
            <span className="badge badge-neutral">Campus Total</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{metrics?.totalStudents || 0}</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Students active in Nivara ecosystem</p>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Daily Check-Ins Logged</div>
            <span className="badge badge-low">Well-being</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>{metrics?.totalCheckins || 0}</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Consented self-reflection entries</p>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Counselling Sessions</div>
            <span className="badge badge-mild">Appointments</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{metrics?.totalAppointments || 0}</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Human support connections initiated</p>
        </div>
      </div>

      {/* PS-29 Bias & Fairness Monitoring Table */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-header">
          <div className="card-title">
            <Scale size={18} color="var(--primary)" /> PS-29 Bias & Disparate Impact Audit
          </div>
          <button onClick={handleRunFairnessAudit} className="btn btn-sm btn-outline" disabled={auditing}>
            <RefreshCw size={13} /> {auditing ? 'Auditing...' : 'Run Audit'}
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Monitors selection and recommendation distribution across demographic groups to ensure equal opportunity and prevent systemic bias.
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '10px 12px' }}>Group / Department</th>
              <th style={{ padding: '10px 12px' }}>Total Students</th>
              <th style={{ padding: '10px 12px' }}>Selection Rate</th>
              <th style={{ padding: '10px 12px' }}>Disparate Impact Ratio</th>
              <th style={{ padding: '10px 12px' }}>Audit Status</th>
            </tr>
          </thead>
          <tbody>
            {fairness.map((f, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{f.groupValue}</td>
                <td style={{ padding: '10px 12px' }}>{f.totalCount}</td>
                <td style={{ padding: '10px 12px' }}>{(f.selectionRate * 100).toFixed(1)}%</td>
                <td style={{ padding: '10px 12px' }}>{f.disparateImpactRatio || 1.0}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span className={`badge ${f.disparityFlag ? 'badge-moderate' : 'badge-low'}`}>
                    {f.disparityFlag ? 'Audit Alert' : 'Balanced (80% Rule)'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Institutional Data Correction Requests Review Panel */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <FileText size={18} color="var(--primary)" /> Student Institutional Data Correction Requests
          </div>
          <span className="badge badge-neutral">{correctionRequests.length} Total Requests</span>
        </div>

        {correctionRequests.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No student data correction requests pending.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {correctionRequests.map((req) => (
              <div key={req._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                    Student: {req.studentId?.email} • Field: {req.fieldName}
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Current: "{req.currentValue}" → Requested: <strong>"{req.requestedValue}"</strong>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '4px' }}>
                    Justification: {req.justification}
                  </div>
                </div>

                {req.status === 'PENDING' ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleReviewCorrection(req._id, 'APPROVED')} className="btn btn-sm btn-primary">
                      <CheckCircle2 size={13} /> Approve
                    </button>
                    <button onClick={() => handleReviewCorrection(req._id, 'REJECTED')} className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }}>
                      <XCircle size={13} /> Reject
                    </button>
                  </div>
                ) : (
                  <span className={`badge ${req.status === 'APPROVED' ? 'badge-low' : 'badge-high'}`}>
                    {req.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
