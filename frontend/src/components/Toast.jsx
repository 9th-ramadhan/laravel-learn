import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 20px',
      background: isSuccess ? 'rgba(16, 185, 129, 0.95)' : 'rgba(244, 63, 94, 0.95)',
      backdropFilter: 'blur(12px)',
      color: '#ffffff',
      borderRadius: 'var(--radius-md)',
      boxShadow: isSuccess 
        ? '0 10px 25px -5px rgba(16, 185, 129, 0.4)' 
        : '0 10px 25px -5px rgba(244, 63, 94, 0.4)',
      fontWeight: 600,
      fontSize: '0.9rem',
      animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
    }}>
      {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span>{message}</span>
      <button 
        onClick={onClose} 
        style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', opacity: 0.8 }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
