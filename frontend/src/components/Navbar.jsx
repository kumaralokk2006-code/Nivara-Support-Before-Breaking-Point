import React, { useState } from 'react';
import Link from 'next/router';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { 
  HeartHandshake, 
  LayoutDashboard, 
  ShieldCheck, 
  CheckCircle2, 
  BookOpen, 
  Coins, 
  LineChart, 
  User, 
  MessageSquareHeart, 
  Users2, 
  LogOut, 
  Menu, 
  X,
  Stethoscope,
  BarChart3
} from 'lucide-react';

const Navbar = () => {
  const { user, profile, logout, isStudent, isCounsellor, isAdmin } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => router.pathname === path;

  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push(user ? (isStudent ? '/student/dashboard' : isCounsellor ? '/counsellor' : '/admin') : '/')}>
          <div style={{ width: '38px', height: '38px', background: 'var(--primary-light)', border: '1px solid var(--primary-border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <HeartHandshake size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>NIVARA</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Support Before The Breaking Point</div>
          </div>
        </div>

        {/* Navigation Links according to user role */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isStudent && (
            <>
              <button onClick={() => router.push('/student/dashboard')} className={`btn btn-sm ${isActive('/student/dashboard') ? 'btn-primary' : 'btn-outline'}`}>
                <LayoutDashboard size={16} /> Dashboard
              </button>
              <button onClick={() => router.push('/student/checkin')} className={`btn btn-sm ${isActive('/student/checkin') ? 'btn-primary' : 'btn-outline'}`}>
                <CheckCircle2 size={16} /> Check-In
              </button>
              <button onClick={() => router.push('/student/academic')} className={`btn btn-sm ${isActive('/student/academic') ? 'btn-primary' : 'btn-outline'}`}>
                <BookOpen size={16} /> Academics
              </button>
              <button onClick={() => router.push('/student/financial')} className={`btn btn-sm ${isActive('/student/financial') ? 'btn-primary' : 'btn-outline'}`}>
                <Coins size={16} /> Financial
              </button>
              <button onClick={() => router.push('/student/insights')} className={`btn btn-sm ${isActive('/student/insights') ? 'btn-primary' : 'btn-outline'}`}>
                <LineChart size={16} /> Insights
              </button>
              <button onClick={() => router.push('/student/support-space')} className={`btn btn-sm ${isActive('/student/support-space') ? 'btn-primary' : 'btn-outline'}`}>
                <MessageSquareHeart size={16} /> AI Space
              </button>
              <button onClick={() => router.push('/student/circles')} className={`btn btn-sm ${isActive('/student/circles') ? 'btn-primary' : 'btn-outline'}`}>
                <Users2 size={16} /> Circles
              </button>
              <button onClick={() => router.push('/student/privacy')} className={`btn btn-sm ${isActive('/student/privacy') ? 'btn-primary' : 'btn-outline'}`}>
                <ShieldCheck size={16} /> Data & Privacy
              </button>
            </>
          )}

          {isCounsellor && (
            <>
              <button onClick={() => router.push('/counsellor')} className={`btn btn-sm ${isActive('/counsellor') ? 'btn-primary' : 'btn-outline'}`}>
                <Stethoscope size={16} /> Counsellor Desk
              </button>
            </>
          )}

          {isAdmin && (
            <>
              <button onClick={() => router.push('/admin')} className={`btn btn-sm ${isActive('/admin') ? 'btn-primary' : 'btn-outline'}`}>
                <BarChart3 size={16} /> Campus Support Admin
              </button>
            </>
          )}
        </nav>

        {/* User context & Auth actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div 
                onClick={() => router.push('/student/profile')} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--bg-main)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                title="View Profile"
              >
                <User size={16} color="var(--primary)" />
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {profile?.name || user.email.split('@')[0]}
                </div>
                <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{user.role}</span>
              </div>
              <button onClick={logout} className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }} title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => router.push('/login')} className="btn btn-sm btn-primary">
                Sign In / Register
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
