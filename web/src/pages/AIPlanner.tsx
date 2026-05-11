import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AIPlanner.css';

interface Activity {
  time: string;
  placeName: string;
  description: string;
  duration: string;
}

interface DayPlan {
  day: number;
  theme: string;
  activities: Activity[];
}

interface AIResponse {
  destination: string;
  totalDays: number;
  title: string;
  summary: string;
  itinerary: DayPlan[];
}

const AIPlanner = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [travelStyle, setTravelStyle] = useState('Dengeli (Ne çok yorucu ne çok rahat)');
  const [interests, setInterests] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AIResponse | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [startDateStr, setStartDateStr] = useState('');
  const [showSaveOptions, setShowSaveOptions] = useState(false);

  const userToken = localStorage.getItem('token');

  const interestOptions = [
    { id: 'Tarih', label: '🏛️ Tarih & Kültür' },
    { id: 'Doğa', label: '🌿 Doğa & Manzara' },
    { id: 'Gastronomi', label: '🍽️ Gastronomi' },
    { id: 'Alışveriş', label: '🛍️ Alışveriş' },
    { id: 'Eğlence', label: '🎢 Eğlence & Gece Hayatı' },
    { id: 'Sanat', label: '🎨 Sanat & Müzeler' },
  ];

  const handleInterestToggle = (id: string) => {
    if (interests.includes(id)) {
      setInterests(interests.filter(i => i !== id));
    } else {
      setInterests([...interests, id]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToken) {
      navigate('/login', { state: { message: 'Yapay zeka planlayıcısını kullanmak için giriş yapmalısınız.' } });
      return;
    }

    if (!destination.trim()) {
      setError('Lütfen gidilecek yeri girin.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/ai/generate-route',
        {
          destination,
          days,
          travelStyle,
          interests
        },
        {
          headers: { 'x-auth-token': userToken }
        }
      );

      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Rota oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRoute = async () => {
    if (!result || !userToken || !startDateStr) return;
    
    setIsSaving(true);
    try {
      const startDate = new Date(startDateStr);
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (result.totalDays - 1));

      const tripData = {
        title: result.title,
        destination: result.destination,
        description: result.summary,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        maxParticipants: 2,
        itinerary: result.itinerary,
        isAiGenerated: true
      };

      await axios.post(
        'http://localhost:5000/api/trips',
        tripData,
        {
          headers: { 'x-auth-token': userToken }
        }
      );
      
      navigate('/my-plans');
    } catch (err: any) {
      alert(err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || 'Kaydedilirken bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="ai-page">
      <div className="ai-hero">
        <div className="ai-hero-inner">
          <div className="ai-badge">✨ AI Destekli</div>
          <h1>Yapay Zeka ile <span>Kusursuz Rotanızı</span> Çizin</h1>
          <p>Siz hayalinizdeki tatili tarif edin, yapay zekamız size saniyeler içinde gün gün planlanmış kişiselleştirilmiş bir seyahat rotası oluştursun.</p>
        </div>
      </div>

      <div className="ai-content">
        <div className="ai-form-container">
          <form onSubmit={handleGenerate} className="ai-form">
            <div className="form-group">
              <label>Nereye gitmek istiyorsunuz?</label>
              <input 
                type="text" 
                placeholder="Örn: Roma, Paris, Kapadokya..." 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Kaç gün?</label>
                <div className="days-control">
                  <button type="button" onClick={() => setDays(Math.max(1, days - 1))}>-</button>
                  <span>{days} Gün</span>
                  <button type="button" onClick={() => setDays(Math.min(14, days + 1))}>+</button>
                </div>
              </div>

              <div className="form-group">
                <label>Seyahat Temposu</label>
                <select value={travelStyle} onChange={(e) => setTravelStyle(e.target.value)}>
                  <option value="Rahat (Günde 1-2 yer, yavaş tempo)">Rahat (Yavaş Tempo)</option>
                  <option value="Dengeli (Ne çok yorucu ne çok rahat)">Dengeli (Klasik Tur)</option>
                  <option value="Yoğun (Çok yer görme odaklı, hızlı tempo)">Yoğun (Hızlı Tempo)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>İlgi Alanlarınız (Birden fazla seçebilirsiniz)</label>
              <div className="interests-grid">
                {interestOptions.map(opt => (
                  <div 
                    key={opt.id}
                    className={`interest-pill ${interests.includes(opt.id) ? 'active' : ''}`}
                    onClick={() => handleInterestToggle(opt.id)}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            </div>

            {error && <div className="ai-error">{error}</div>}

            <button type="submit" className="ai-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span> Yapay Zeka Planlıyor...
                </>
              ) : (
                '✨ Rotamı Oluştur'
              )}
            </button>
            {!userToken && <p className="login-warning">Plan oluşturmak için giriş yapmanız gerekmektedir.</p>}
          </form>
        </div>

        {/* Sonuç Alanı */}
        {result && (
          <div className="ai-result-container">
            <div className="ai-result-header">
              <h2>{result.title}</h2>
              <p className="ai-result-summary">{result.summary}</p>
              <div className="ai-result-meta">
                <span>📍 {result.destination}</span>
                <span>⏱️ {result.totalDays} Gün</span>
              </div>
            </div>

            <div className="ai-timeline">
              {result.itinerary.map((day, idx) => (
                <div key={idx} className="timeline-day">
                  <div className="day-badge">Gün {day.day}</div>
                  <h3 className="day-theme">{day.theme}</h3>
                  
                  <div className="activities-list">
                    {day.activities.map((act, i) => (
                      <div key={i} className="activity-card">
                        <div className="activity-time">{act.time}</div>
                        <div className="activity-content">
                          <h4>{act.placeName}</h4>
                          <p>{act.description}</p>
                          <span className="activity-duration">⏱️ Önerilen Süre: {act.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="ai-actions">
              {!showSaveOptions ? (
                <button className="save-btn" onClick={() => setShowSaveOptions(true)}>
                  ❤️ Bu Rotayı Planlarıma Kaydet
                </button>
              ) : (
                <div className="save-options">
                  <div className="form-group" style={{ textAlign: 'left', marginBottom: '15px' }}>
                    <label>Başlangıç Tarihi</label>
                    <input 
                      type="date" 
                      value={startDateStr} 
                      onChange={(e) => setStartDateStr(e.target.value)} 
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="save-actions">
                    <button className="save-confirm-btn" onClick={handleSaveRoute} disabled={isSaving || !startDateStr}>
                      {isSaving ? 'Kaydediliyor...' : 'Onayla ve Kaydet'}
                    </button>
                    <button className="save-cancel-btn" onClick={() => setShowSaveOptions(false)} disabled={isSaving}>
                      İptal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPlanner;
