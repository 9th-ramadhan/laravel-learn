import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookUser, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '16px 32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px var(--primary-glow)'
          }}>
            <BookUser size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.1 }}>
              Contact<span style={{ color: 'var(--primary)' }}>Vault</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Management System</p>
          </div>
        </div>

        {/* User Info & Logout */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 14px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserIcon size={16} color="var(--primary)" />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{user.name}</p>
                <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{user.email}</p>
              </div>
            </div>

            <button 
              onClick={logout}
              className="btn btn-secondary btn-sm"
              title="Keluar"
            >
              <LogOut size={16} />
              <span>Keluar</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
};

export default Navbar;
