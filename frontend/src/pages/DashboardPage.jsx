import React, { useState, useEffect } from 'react';
import client from '../api/client';
import ContactCard from '../components/ContactCard';
import ContactFormModal from '../components/ContactFormModal';
import ContactDetailModal from '../components/ContactDetailModal';
import Toast from '../components/Toast';
import { Plus, Search, Grid, List, Users, PhoneCall, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';

const DashboardPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null); // for edit
  const [detailContact, setDetailContact] = useState(null); // for detail modal
  const [deleteContact, setDeleteContact] = useState(null); // for delete confirm

  // Toast state
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await client.get('/kontak');
      setContacts(res.data.data || []);
    } catch (err) {
      showToast('Gagal mengambil data kontak dari server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCreateOrUpdate = async (formData) => {
    if (selectedContact) {
      // Edit
      await client.put(`/kontak/${selectedContact.id}`, formData);
      showToast('Kontak berhasil diperbarui!');
    } else {
      // Create
      await client.post('/kontak', formData);
      showToast('Kontak baru berhasil ditambahkan!');
    }
    fetchContacts();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteContact) return;
    try {
      await client.delete(`/kontak/${deleteContact.id}`);
      showToast('Kontak berhasil dihapus.');
      fetchContacts();
    } catch (err) {
      showToast('Gagal menghapus kontak.', 'error');
    } finally {
      setDeleteContact(null);
    }
  };

  // Filtered contacts
  const filteredContacts = contacts.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchName = c.nama?.toLowerCase().includes(q);
    const matchAddress = c.alamat?.toLowerCase().includes(q);
    const matchPhone = c.phones?.some(p => p.nomor_telepon.includes(q));
    return matchName || matchAddress || matchPhone;
  });

  // Calculate totals
  const totalPhones = contacts.reduce((acc, curr) => acc + (curr.phones?.length || 0), 0);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 64px 24px' }}>
      
      {/* Dashboard Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '18px',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={28} color="var(--primary)" />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL KONTAK</p>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {contacts.length}
            </h2>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '18px',
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <PhoneCall size={28} color="var(--secondary)" />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL TELEPON TERHUBUNG</p>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {totalPhones}
            </h2>
          </div>
        </div>

      </div>

      {/* Toolbar: Search, Refresh, View Switch, Add Button */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '28px'
      }}>
        
        {/* Search Bar */}
        <div style={{ position: 'relative', flex: 1, minWidth: '280px', maxWidth: '440px' }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '48px', height: '46px', borderRadius: 'var(--radius-lg)' }}
            placeholder="Cari berdasarkan nama, alamat, atau nomor telepon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          <button 
            onClick={fetchContacts} 
            className="btn btn-secondary btn-icon"
            title="Refresh Data"
            style={{ height: '46px', width: '46px', borderRadius: 'var(--radius-lg)' }}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>

          {/* View Toggle */}
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Grid View"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: viewMode === 'table' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'table' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Table View"
            >
              <List size={18} />
            </button>
          </div>

          <button
            onClick={() => { setSelectedContact(null); setIsFormOpen(true); }}
            className="btn btn-primary"
            style={{ height: '46px', padding: '0 20px', borderRadius: 'var(--radius-lg)' }}
          >
            <Plus size={20} />
            <span>Tambah Kontak</span>
          </button>

        </div>

      </div>

      {/* Main Content Loading / Empty / Grid / Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <Loader2 size={36} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto 16px auto' }} />
          <p>Memuat data kontak...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '64px 24px' }}>
          <Users size={48} color="var(--text-dim)" style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '8px' }}>Tidak Ada Data Kontak</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {searchQuery ? `Tidak ada kontak yang cocok dengan pencarian "${searchQuery}"` : 'Belum ada kontak tersimpan dalam sistem.'}
          </p>
          {!searchQuery && (
            <button onClick={() => { setSelectedContact(null); setIsFormOpen(true); }} className="btn btn-primary">
              <Plus size={18} />
              <span>Tambah Kontak Pertama</span>
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredContacts.map(c => (
            <ContactCard
              key={c.id}
              contact={c}
              onView={(item) => setDetailContact(item)}
              onEdit={(item) => { setSelectedContact(item); setIsFormOpen(true); }}
              onDelete={(item) => setDeleteContact(item)}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '16px 24px' }}>ID</th>
                <th style={{ padding: '16px 24px' }}>NAMA</th>
                <th style={{ padding: '16px 24px' }}>ALAMAT</th>
                <th style={{ padding: '16px 24px' }}>TGL LAHIR</th>
                <th style={{ padding: '16px 24px' }}>TELEPON</th>
                <th style={{ padding: '16px 24px', textAlign: 'right' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'var(--transition)' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-dim)' }}>#{c.id}</td>
                  <td style={{ padding: '16px 24px', fontWeight: 700, color: 'var(--text-main)' }}>{c.nama}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>{c.alamat}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>{c.tanggal_lahir}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {c.phones?.map((p, i) => (
                        <span key={i} className="badge badge-indigo">{p.jenis}: {p.nomor_telepon}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button onClick={() => setDetailContact(c)} className="btn btn-secondary btn-sm">Detail</button>
                      <button onClick={() => { setSelectedContact(c); setIsFormOpen(true); }} className="btn btn-secondary btn-sm">Edit</button>
                      <button onClick={() => setDeleteContact(c)} className="btn btn-danger btn-sm">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <ContactFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={selectedContact}
      />

      <ContactDetailModal
        isOpen={Boolean(detailContact)}
        onClose={() => setDetailContact(null)}
        contact={detailContact}
        onEdit={(item) => { setDetailContact(null); setSelectedContact(item); setIsFormOpen(true); }}
      />

      {/* Delete Confirmation Modal */}
      {deleteContact && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '32px', maxWidth: '440px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(244, 63, 94, 0.15)',
                color: 'var(--danger)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <AlertTriangle size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                Hapus Kontak?
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Apakah Anda yakin ingin menghapus kontak <strong>"{deleteContact.nama}"</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteContact(null)} className="btn btn-secondary" style={{ flex: 1 }}>
                Batal
              </button>
              <button onClick={handleDeleteConfirm} className="btn btn-danger" style={{ flex: 1 }}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

    </div>
  );
};

export default DashboardPage;
