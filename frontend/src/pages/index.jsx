import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, ShieldCheck, HelpCircle, BookOpen, Coins, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { user, isStudent, isCounsellor, isAdmin } = useAuth();

  return (
    <div className="container">
      {/* Hero Banner */}
      <div style={{ textAlign: 'center', padding: '48px 0 36px 0', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary-light)', padding: '6px 16px', borderRadius: '24px', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
          <HeartHandshake size={16} /> SIH 2025/2026 PS-29 Platform
        </div>
        <h1 style={{ fontSize: '2.5rem', lineHeight: 1.2, marginBottom: '16px' }}>
          Early Student Support & Well-being Ecosystem
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
          Identifying students who may need academic, financial, or well-being support using minimal and consented data — <strong>support before the breaking point</strong>.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
          {user ? (
            <button 
              onClick={() => router.push(isStudent ? '/student/dashboard' : isCounsellor ? '/counsellor' : '/admin')} 
              className="btn btn-primary btn-lg"
            >
              Go to My Dashboard <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <button onClick={() => router.push('/login')} className="btn btn-primary btn-lg">
                Enter Nivara Portal <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid-3" style={{ marginBottom: '48px' }}>
        <div className="card">
          <div style={{ background: '#eff6ff', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', marginBottom: '14px' }}>
            <BookOpen size={22} />
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Academic Support</h3>
          <p style={{ fontSize: '0.9rem' }}>
            Detects subject challenges and exam pressure to connect students with peer tutors, faculty mentors, and study clinics.
          </p>
        </div>

        <div className="card">
          <div style={{ background: '#ecfdf5', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', marginBottom: '14px' }}>
            <Coins size={22} />
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Financial Navigator</h3>
          <p style={{ fontSize: '0.9rem' }}>
            Minimal, non-judgmental guidance matching students to scholarships, installment schemes, and emergency funds with zero bank data.
          </p>
        </div>

        <div className="card">
          <div style={{ background: '#fdf2f8', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#db2777', marginBottom: '14px' }}>
            <Heart size={22} />
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Well-being & Care</h3>
          <p style={{ fontSize: '0.9rem' }}>
            Consented daily check-in reflections, AI Support Space with layered safety screening, and confidential counselling appointments.
          </p>
        </div>
      </div>

      {/* Core Principles Callout */}
      <div className="card" style={{ background: '#f8fafc', padding: '32px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Non-Punitive & Explainable By Design</h2>
        <p style={{ maxWidth: '680px', margin: '0 auto 20px auto' }}>
          Nivara has zero capability to alter grades, cancel scholarships, or trigger disciplinary actions. Every support option transparently answers <em>"Why am I seeing this?"</em>.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
          <span>✓ Minimal Consented Data</span>
          <span>✓ Bias & Fairness Monitoring</span>
          <span>✓ Student Data Correction</span>
          <span>✓ No High-Risk Labels</span>
        </div>
      </div>
    </div>
  );
}
