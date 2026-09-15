import React from 'react';
import { Phone, MapPin, Calendar, Edit3, Trash2, Eye } from 'lucide-react';

const getBadgeStyle = (jenis) => {
  const lower = jenis?.toLowerCase() || '';
  if (lower.includes('handphone') || lower.includes('hp')) return 'badge-indigo';
  if (lower.includes('rumah')) return 'badge-emerald';
  if (lower.includes('kantor')) return 'badge-amber';
  return 'badge-violet';
};

const ContactCard = ({ contact, onView, onEdit, onDelete }) => {
  const formattedDate = contact.tanggal_lahir 
    ? new Date(contact.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : '-';

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header Profile Avatar & Action */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.3))',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1.2rem',
            color: '#ffffff'
          }}>
            {contact.nama ? contact.nama.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {contact.nama}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'inline-block' }}>
              ID: #{contact.id}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => onView(contact)} className="btn btn-secondary btn-icon btn-sm" title="Detail">
            <Eye size={16} color="var(--primary)" />
          </button>
          <button onClick={() => onEdit(contact)} className="btn btn-secondary btn-icon btn-sm" title="Edit">
            <Edit3 size={16} color="var(--warning)" />
          </button>
          <button onClick={() => onDelete(contact)} className="btn btn-secondary btn-icon btn-sm" title="Hapus">
            <Trash2 size={16} color="var(--danger)" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {contact.alamat || 'Alamat belum diisi'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={16} color="var(--secondary)" style={{ flexShrink: 0 }} />
          <span>Lahir: {formattedDate}</span>
        </div>
      </div>

      {/* Phones List */}
      <div style={{
        marginTop: '8px',
        paddingTop: '14px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.775rem', color: 'var(--text-dim)', fontWeight: 600 }}>
          <Phone size={14} />
          <span>NOMOR TELEPON ({contact.phones?.length || 0})</span>
        </div>

        {contact.phones && contact.phones.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {contact.phones.map((phone, idx) => (
              <div key={idx} className={`badge ${getBadgeStyle(phone.jenis)}`}>
                <span>{phone.jenis}:</span>
                <span style={{ fontWeight: 700 }}>{phone.nomor_telepon}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', italic: 'true' }}>Tidak ada nomor telepon</p>
        )}
      </div>

    </div>
  );
};

export default ContactCard;
