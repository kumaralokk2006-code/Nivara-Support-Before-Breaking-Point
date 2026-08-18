import React from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/router';

const ConsentWarning = ({ consentType, title = 'Consent Required' }) => {
  const router = useRouter();

  return (
    <div className="card" style={{ background: '#fffbeb', borderColor: '#fde68a', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '10px', color: '#b45309' }}>
          <ShieldAlert size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.05rem', color: '#92400e', marginBottom: '4px' }}>{title}</h3>
          <p style={{ color: '#b45309', fontSize: '0.9rem', marginBottom: '14px' }}>
            Nivara operates strictly on informed consent. To use this support module, please enable the required data permission in your Privacy settings.
          </p>
          <button onClick={() => router.push('/student/privacy')} className="btn btn-sm btn-primary" style={{ background: '#d97706', borderColor: '#b45309' }}>
            Manage Consent in Data & Privacy <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentWarning;
