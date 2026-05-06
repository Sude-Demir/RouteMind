import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './CreateTrip.css'; // Inline css or separate

const CreateTrip = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    description: '',
    startDate: '',
    endDate: '',
    maxParticipants: 5,
    imageUrl: ''
  });

  const { title, destination, description, startDate, endDate, maxParticipants, imageUrl } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if startDate is in the past (extra security check)
    const todayStr = new Date().toISOString().split('T')[0];
    if (startDate < todayStr) {
      setError('Geçmiş bir tarihe plan yapamazsınız.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Bitiş tarihi başlangıç tarihinden önce olamaz.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const { imageUrl, ...rest } = formData;
      const payload = imageUrl ? formData : rest;
      
      await api.post('/trips', payload);
      navigate('/trips');
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map((e: any) => e.msg).join(', '));
      } else {
        setError(err.response?.data?.msg || 'Grup oluşturulurken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for the min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="create-trip-page">
      <div className="create-trip-container">
        <h2>🏕️ Yeni <span>Gezi Grubu</span> Oluştur</h2>
        <p className="create-trip-subtitle">Rotanı belirle, insanları davet et ve unutulmaz anılar biriktir.</p>

        {error && <div className="create-trip-error">{error}</div>}

        <form onSubmit={onSubmit} className="create-trip-form">
          <div className="form-group">
            <label>Gezi Başlığı</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={onChange}
              placeholder="Örn: Karadeniz Yayla Turu 2026"
              required
            />
          </div>

          <div className="form-group">
            <label>Varış Noktası / Rota</label>
            <input
              type="text"
              name="destination"
              value={destination}
              onChange={onChange}
              placeholder="Örn: Rize, Ayder Yaylası"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Başlangıç Tarihi</label>
              <input
                type="date"
                name="startDate"
                value={startDate}
                min={today}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Bitiş Tarihi</label>
              <input
                type="date"
                name="endDate"
                value={endDate}
                min={startDate || today}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Maksimum Katılımcı Sayısı</label>
              <input
                type="number"
                name="maxParticipants"
                value={maxParticipants}
                onChange={onChange}
                min="2"
                max="50"
                required
              />
              <small>Seninle birlikte toplam kişi sayısı (2-50 arası)</small>
            </div>
            <div className="form-group">
              <label>Kapak Görseli URL (İsteğe Bağlı)</label>
              <input
                type="text"
                name="imageUrl"
                value={imageUrl}
                onChange={onChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="form-group">
            <label>Gezi Açıklaması & Kurallar</label>
            <textarea
              name="description"
              value={description}
              onChange={onChange}
              placeholder="Bu gezide neler yapacağız? Konaklama nasıl olacak? Masraflar nasıl bölüşülecek? Katılımcılardan beklentileriniz nelerdir?"
              rows={5}
              required
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/trips')}>
              İptal
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Oluşturuluyor...' : 'Grubu Kur ve Yayınla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;
