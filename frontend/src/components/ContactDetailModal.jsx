import React from 'react';
import { X, MapPin, Calendar, Phone, Edit3, UserCheck } from 'lucide-react';

const ContactDetailModal = ({ isOpen, onClose, contact, onEdit }) => {
  if (!isOpen || !contact) return null;

  const formattedDate = contact.tanggal_lahir 
    ? new Date(contact.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-';

  const getAge = (dateStr) => {
    if (!dateStr) return null;
    const birth = new Date(dateStr);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = getAge(contact.tanggal_lahir);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '32px' }}>
        
        {/* Header Modal */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
            <UserCheck size={18} />
            <span>DETAIL KONTAK</span>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-icon btn-sm">
            <X size={18} />
          </button>
        </div>

        {/* Profile Card Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: 700,
            color: '#ffffff',
            boxShadow: '0 8px 20px var(--primary-glow)'
          }}>
            {contact.nama ? contact.nama.charAt(0).toUpperCase() : '?'}
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
              {contact.nama}
            </h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span className="badge badge-indigo">ID: #{contact.id}</span>
              {age !== null && <span className="badge badge-emerald">{age} Tahun</span>}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={18} color="var(--primary)" />
            </div>
            <div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-dim)', fontWeight: 600 }}>ALAMAT</p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '2px' }}>{contact.alamat}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Calendar size={18} color="var(--secondary)" />
            </div>
            <div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-dim)', fontWeight: 600 }}>TANGGAL LAHIR</p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '2px' }}>{formattedDate}</p>
            </div>
          </div>

          {/* Phones Section */}
          <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-dim)', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} color="var(--primary)" />
              <span>DAFTAR NOMOR TELEPON ({contact.phones?.length || 0})</span>
            </p>

            {contact.phones && contact.phones.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {contact.phones.map((p, idx) => (
                  <div key={idx} style={{
                    padding: '12px 16px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>{p.jenis}</span>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '0.02em' }}>{p.nomor_telepon}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Belum ada nomor telepon tersimpan.</p>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Tutup
          </button>
          <button onClick={() => { onClose(); onEdit(contact); }} className="btn btn-primary">
            <Edit3 size={16} />
            <span>Edit Kontak Ini</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ContactDetailModal;
