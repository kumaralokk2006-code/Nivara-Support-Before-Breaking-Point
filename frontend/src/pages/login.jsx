import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, LogIn, UserPlus, AlertCircle, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration specific fields
  const [role, setRole] = useState('STUDENT');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('B.Tech Computer Science');
  const [year, setYear] = useState(1);
  const [department, setDepartment] = useState('Engineering');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        await register({
          email,
          password,
          role,
          name,
          course,
          year: Number(year),
          department
        });
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '520px', padding: '40px 20px' }}>
      <div className="card" style={{ padding: '36px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 12px auto' }}>
            <HeartHandshake size={28} />
          </div>
          <h1 style={{ fontSize: '1.6rem' }}>{isRegistering ? 'Create Nivara Account' : 'Welcome to Nivara'}</h1>
          <p style={{ marginTop: '4px' }}>
            {isRegistering ? 'Register for student, counsellor, or admin support' : 'Sign in to access your support ecosystem'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: 'flex', background: 'var(--bg-main)', padding: '4px', borderRadius: '8px', marginBottom: '24px', border: '1px solid var(--border)' }}>
          <button 
            type="button"
            onClick={() => { setIsRegistering(false); setError(''); }}
            className={`btn btn-sm ${!isRegistering ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1, border: 'none', background: !isRegistering ? 'var(--primary)' : 'transparent', color: !isRegistering ? '#fff' : 'var(--text-main)' }}
          >
            <LogIn size={14} /> Sign In
          </button>
          <button 
            type="button"
            onClick={() => { setIsRegistering(true); setError(''); }}
            className={`btn btn-sm ${isRegistering ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1, border: 'none', background: isRegistering ? 'var(--primary)' : 'transparent', color: isRegistering ? '#fff' : 'var(--text-main)' }}
          >
            <UserPlus size={14} /> Register
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" type="text" placeholder="e.g. Rahul Kumar" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Role *</label>
                <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="STUDENT">STUDENT</option>
                  <option value="COUNSELLOR">COUNSELLOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              {role === 'STUDENT' && (
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Course</label>
                    <input className="form-input" type="text" value={course} onChange={(e) => setCourse(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year of Study</label>
                    <input className="form-input" type="number" min="1" max="5" value={year} onChange={(e) => setYear(e.target.value)} />
                  </div>
                </div>
              )}
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input className="form-input" type="email" placeholder="name@campus.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Authenticating...' : isRegistering ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', color: 'var(--success)' }} />
          Protected by Nivara consent-first privacy protocols.
        </div>
      </div>
    </div>
  );
}
