import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { circleService } from '../../services/circleService';
import { Users2, MessageSquare, Send, ShieldCheck, Plus } from 'lucide-react';

export default function SupportCirclesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [circles, setCircles] = useState([]);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [postMsg, setPostMsg] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'STUDENT')) {
      router.push('/login');
      return;
    }
    loadCircles();
  }, [user, authLoading]);

  const loadCircles = async () => {
    setLoading(true);
    try {
      const res = await circleService.listCircles();
      setCircles(res.circles || []);
      if (res.circles && res.circles.length > 0) {
        handleSelectCircle(res.circles[0]._id);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCircle = async (id) => {
    try {
      const res = await circleService.getCircle(id);
      setSelectedCircle(res.circle);
      setPosts(res.posts || []);
    } catch (e) {
      console.warn(e);
    }
  };

  const handlePostMessage = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !selectedCircle) return;

    try {
      const res = await circleService.createPost(selectedCircle._id, newPost);
      setPostMsg(res.message || 'Post submitted');
      setNewPost('');
      handleSelectCircle(selectedCircle._id);
      setTimeout(() => setPostMsg(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', padding: '4px 12px', borderRadius: '20px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>
          <Users2 size={14} /> Temporary Peer Rooms
        </div>
        <h1>Temporary Support Circles</h1>
        <p>Connect anonymously with peers navigating similar challenges in safe, AI-moderated temporary support rooms.</p>
      </div>

      <div className="grid-3" style={{ alignItems: 'flex-start' }}>
        {/* Circle List Column */}
        <div className="card" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Active Peer Circles</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {circles.map((c) => (
              <div 
                key={c._id}
                onClick={() => handleSelectCircle(c._id)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: selectedCircle?._id === c._id ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: selectedCircle?._id === c._id ? 'var(--primary-light)' : '#ffffff'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {c.category.replace(/_/g, ' ')} • {c.memberCount || 0} peers
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Circle Discussion Column */}
        <div className="card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', height: '520px', padding: 0 }}>
          {selectedCircle ? (
            <>
              <div className="card-header" style={{ padding: '16px 20px', margin: 0 }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem' }}>{selectedCircle.name}</h3>
                  <p style={{ fontSize: '0.8rem' }}>{selectedCircle.description}</p>
                </div>
                <span className="badge badge-low">AI Moderated</span>
              </div>

              {postMsg && <div className="alert alert-info" style={{ margin: '10px 20px 0 20px' }}>{postMsg}</div>}

              {/* Discussion Feed */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {posts.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>No messages shared in this room yet. Be the first to share your thoughts!</p>
                ) : (
                  posts.map((p) => (
                    <div key={p._id} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{p.anonymousAlias || 'Peer Student'}</span>
                        <span>{new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{p.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Post Input */}
              <form onSubmit={handlePostMessage} style={{ padding: '14px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Share supportive words with peers..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  <Send size={14} /> Post
                </button>
              </form>
            </>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center' }}>Select a circle to view messages</div>
          )}
        </div>
      </div>
    </div>
  );
}
