import React from 'react';
import { ShieldCheck, Heart, PhoneCall } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: '#ffffff', borderTop: '1px solid var(--border)', padding: '24px 0', marginTop: 'auto' }}>
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
            <span>NIVARA</span>
            <span style={{ color: 'var(--text-light)' }}>•</span>
            <span style={{ fontWeight: 500, color: 'var(--text-muted)', fontSize: '0.85rem' }}>SIH PS-29 Early Student Support Platform</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Non-punitive by design: Nivara support signals are never used for academic penalties, grading, or disciplinary actions.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PhoneCall size={14} color="var(--primary)" />
            <span>Tele-MANAS Helpline: <strong>14416</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="var(--success)" />
            <span>Consent-First Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
