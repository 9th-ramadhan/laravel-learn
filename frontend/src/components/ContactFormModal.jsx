import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Loader2, Phone } from 'lucide-react';

const ContactFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [phones, setPhones] = useState([{ jenis: 'Handphone', nomor_telepon: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setNama(initialData.nama || '');
      setAlamat(initialData.alamat || '');
      setTanggalLahir(initialData.tanggal_lahir || '');
      setPhones(
        initialData.phones && initialData.phones.length > 0
          ? initialData.phones.map(p => ({ jenis: p.jenis, nomor_telepon: p.nomor_telepon }))
          : [{ jenis: 'Handphone', nomor_telepon: '' }]
      );
    } else {
      setNama('');
      setAlamat('');
      setTanggalLahir('');
      setPhones([{ jenis: 'Handphone', nomor_telepon: '' }]);
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handlePhoneChange = (index, field, value) => {
    const updated = [...phones];
    updated[index][field] = value;
    setPhones(updated);
  };

  const addPhoneField = () => {
    setPhones([...phones, { jenis: 'Handphone', nomor_telepon: '' }]);
  };

  const removePhoneField = (index) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama.trim() || !alamat.trim() || !tanggalLahir) {
      setError('Harap isi semua bidang wajib (Nama, Alamat, dan Tanggal Lahir)');
      return;
    }

    // Filter valid phone entries
    const validPhones = phones.filter(p => p.nomor_telepon.trim() !== '');

    setLoading(true);
    setError('');

    try {
      await onSubmit({
        nama,
        alamat,
        tanggal_lahir: tanggalLahir,
        phones: validPhones,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data kontak. Periksa kembali inputan Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '32px' }}>
        
        {/* Header Modal */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {initialData ? 'Edit Kontak' : 'Tambah Kontak Baru'}
          </h2>
          <button onClick={onClose} className="btn btn-secondary btn-icon btn-sm">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#fda4af',
            fontSize: '0.875rem',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="form-group">
            <label className="form-label">Nama Lengkap *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: Budi Santoso"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Alamat *</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Contoh: Jl. Sudirman No. 12, Jakarta"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tanggal Lahir *</label>
            <input
              type="date"
              className="form-input"
              value={tanggalLahir}
              onChange={(e) => setTanggalLahir(e.target.value)}
              required
            />
          </div>

          {/* Dynamic Phone Numbers */}
          <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={16} color="var(--primary)" />
                <span>Nomor Telepon</span>
              </label>
              <button
                type="button"
                onClick={addPhoneField}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={14} />
                <span>Tambah Nomor</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {phones.map((phone, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select
                    className="form-select"
                    style={{ width: '130px', flexShrink: 0 }}
                    value={phone.jenis}
                    onChange={(e) => handlePhoneChange(idx, 'jenis', e.target.value)}
                  >
                    <option value="Handphone">Handphone</option>
                    <option value="Rumah">Rumah</option>
                    <option value="Kantor">Kantor</option>
                    <option value="Pribadi">Pribadi</option>
                  </select>

                  <input
                    type="text"
                    className="form-input"
                    placeholder="081234567890"
                    value={phone.nomor_telepon}
                    onChange={(e) => handlePhoneChange(idx, 'nomor_telepon', e.target.value)}
                  />

                  {phones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhoneField(idx)}
                      className="btn btn-danger btn-icon btn-sm"
                      style={{ flexShrink: 0 }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span>{initialData ? 'Simpan Perubahan' : 'Tambah Kontak'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ContactFormModal;
