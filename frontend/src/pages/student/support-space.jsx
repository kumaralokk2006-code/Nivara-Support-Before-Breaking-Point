import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { aiService } from '../../services/aiService';
import { MessageSquareHeart, Send, ShieldAlert, PhoneCall, Bot, User } from 'lucide-react';

export default function AISupportSpace() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm Nivara Support Space, an empathetic companion here to listen and help connect you to campus resources. What's on your mind today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [campusResources, setCampusResources] = useState(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'STUDENT')) {
      router.push('/login');
      return;
    }
    aiService.getCampusResources().then(res => setCampusResources(res.campusSupport)).catch(() => {});
  }, [user, authLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await aiService.chat(userMsg);
      setMessages([...newMessages, {
        role: 'assistant',
        content: res.message,
        isCrisis: res.isCrisisIntervention,
        suggestedActions: res.suggestedActions || []
      }]);
    } catch (err) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'I apologize, but I had trouble responding. If you are experiencing distress, please connect with campus counseling or call Tele-MANAS at 14416.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', padding: '4px 12px', borderRadius: '20px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>
          <MessageSquareHeart size={14} /> Safe Supportive Chat
        </div>
        <h1>AI Support Space</h1>
        <p>A confidential, non-diagnostic space for reflection and support navigation. Equipped with instant safety screening.</p>
      </div>

      {/* Chat Box */}
      <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '520px', marginBottom: '20px' }}>
        {/* Message Log */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
              {m.role === 'assistant' && (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: m.isCrisis ? 'var(--danger-light)' : 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: m.isCrisis ? 'var(--danger)' : 'var(--primary)' }}>
                  <Bot size={18} />
                </div>
              )}
              <div style={{
                background: m.role === 'user' ? 'var(--primary)' : m.isCrisis ? '#fff1f2' : '#f8fafc',
                color: m.role === 'user' ? '#ffffff' : 'var(--text-main)',
                border: m.role === 'user' ? 'none' : m.isCrisis ? '1px solid #fecdd3' : '1px solid var(--border)',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap'
              }}>
                {m.content}

                {/* Suggested Action Chips */}
                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                    {m.suggestedActions.map((act, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => {
                          if (act.type === 'BOOK_COUNSELLOR') router.push('/student/dashboard');
                          else if (act.type === 'FINANCIAL_NAVIGATOR') router.push('/student/financial');
                          else if (act.type === 'ACADEMIC_NAVIGATOR') router.push('/student/academic');
                          else router.push('/student/checkin');
                        }}
                        className="btn btn-sm btn-outline" 
                        style={{ fontSize: '0.75rem', background: '#ffffff' }}
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Nivara is thinking supportive thoughts...</div>}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} style={{ padding: '14px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px', background: '#ffffff', borderRadius: '0 0 var(--radius) var(--radius)' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Emergency Helpline Notice */}
      <div className="alert alert-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PhoneCall size={18} />
          <span>24/7 Crisis Hotline: <strong>{campusResources?.CRISIS_HELPLINE_INFO || 'Tele-MANAS (14416)'}</strong></span>
        </div>
      </div>
    </div>
  );
}
