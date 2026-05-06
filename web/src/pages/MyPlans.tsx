import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './MyPlans.css';

interface User {
  _id: string;
  name: string;
}

interface Trip {
  _id: string;
  title: string;
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  creator: User;
  participants: User[];
  maxParticipants: number;
  status: string;
}

const MyPlans = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const currentUser = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!token || !currentUser) {
      navigate('/login');
      return;
    }
    fetchMyTrips();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchMyTrips = async () => {
    try {
      setLoading(true);
      const res = await api.get('/trips/my');   // token api interceptor ile otomatik gönderiliyor
      setTrips(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Planlar yüklenirken bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveTrip = async (tripId: string) => {
    if (!window.confirm('Bu gruptan ayrılmak istediğinize emin misiniz?')) return;
    try {
      await api.put(`/trips/${tripId}/leave`);
      setTrips(trips.filter(t => t._id !== tripId));
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Bir hata oluştu');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const getDaysLeft = (startDate: string) => {
    const diff = new Date(startDate).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: 'Tamamlandı', color: '#9e8e7e' };
    if (days === 0) return { text: 'Bugün!', color: '#2ecc71' };
    if (days === 1) return { text: 'Yarın!', color: '#f39c12' };
    return { text: `${days} gün kaldı`, color: '#1a3c34' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return '🗓️';
      case 'ongoing': return '🚀';
      case 'completed': return '✅';
      default: return '📍';
    }
  };

  if (loading) {
    return (
      <div className="myplans-page">
        <div className="myplans-loading">
          <div className="myplans-spinner"></div>
          <p>Planların yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="myplans-page">
      {/* Header */}
      <div className="myplans-header">
        <div className="myplans-header-text">
          <h1>📅 Planlarım</h1>
          <p>Katıldığın tüm gezi grupları burada listeleniyor.</p>
        </div>
        <Link to="/trips" className="myplans-explore-btn">
          🌍 Tüm Gezileri Gör
        </Link>
      </div>

      {error && <div className="myplans-error">{error}</div>}

      {trips.length === 0 ? (
        <div className="myplans-empty">
          <div className="myplans-empty-icon">🗺️</div>
          <h2>Henüz bir geziye katılmadın</h2>
          <p>Aşağıdan mevcut gezi gruplarına göz at ve ilk adımını at!</p>
          <Link to="/trips" className="myplans-explore-btn">
            Gezileri Keşfet →
          </Link>
        </div>
      ) : (
        <>
          {/* Stats Bar */}
          <div className="myplans-stats">
            <div className="myplans-stat">
              <span className="myplans-stat-num">{trips.length}</span>
              <span className="myplans-stat-label">Toplam Plan</span>
            </div>
            <div className="myplans-stat">
              <span className="myplans-stat-num">
                {trips.filter(t => t.status === 'upcoming').length}
              </span>
              <span className="myplans-stat-label">Yaklaşan</span>
            </div>
            <div className="myplans-stat">
              <span className="myplans-stat-num">
                {trips.filter(t => t.status === 'completed').length}
              </span>
              <span className="myplans-stat-label">Tamamlanan</span>
            </div>
            <div className="myplans-stat">
              <span className="myplans-stat-num">
                {trips.filter(t => currentUser && t.creator._id === currentUser.id).length}
              </span>
              <span className="myplans-stat-label">Kurduğun</span>
            </div>
          </div>

          {/* Trip Cards */}
          <div className="myplans-list">
            {trips.map((trip) => {
              const isCreator = currentUser && trip.creator._id === currentUser.id;
              const daysLeft = getDaysLeft(trip.startDate);
              const progress = (trip.participants.length / trip.maxParticipants) * 100;

              return (
                <div key={trip._id} className="myplan-card">
                  <div className="myplan-img-col">
                    <img src={trip.imageUrl} alt={trip.title} />
                    <div className="myplan-days-badge" style={{ backgroundColor: daysLeft.color }}>
                      {daysLeft.text}
                    </div>
                  </div>

                  <div className="myplan-info-col">
                    <div className="myplan-top">
                      <div>
                        <div className="myplan-destination">
                          {getStatusIcon(trip.status)} {trip.destination}
                          {isCreator && <span className="myplan-creator-badge">Kurucusun</span>}
                        </div>
                        <h3 className="myplan-title">{trip.title}</h3>
                      </div>
                    </div>

                    <p className="myplan-desc">{trip.description}</p>

                    <div className="myplan-meta">
                      <div className="myplan-meta-item">
                        <span className="myplan-meta-icon">📅</span>
                        <div>
                          <div className="myplan-meta-label">Tarih</div>
                          <div className="myplan-meta-val">
                            {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
                          </div>
                        </div>
                      </div>
                      <div className="myplan-meta-item">
                        <span className="myplan-meta-icon">👥</span>
                        <div>
                          <div className="myplan-meta-label">Organizatör</div>
                          <div className="myplan-meta-val">{trip.creator.name}</div>
                        </div>
                      </div>
                    </div>

                    <div className="myplan-progress-row">
                      <div className="myplan-progress-info">
                        <span>Grup Doluluk Oranı</span>
                        <span>{trip.participants.length}/{trip.maxParticipants} kişi</span>
                      </div>
                      <div className="myplan-progress-bar">
                        <div className="myplan-progress-fill" style={{ width: `${progress}%` }}></div>
                      </div>
                      <div className="myplan-participants">
                        {trip.participants.slice(0, 6).map((p, i) => (
                          <div
                            key={p._id}
                            className="myplan-avatar"
                            title={p.name}
                            style={{ zIndex: 10 - i }}
                          >
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {trip.participants.length > 6 && (
                          <div className="myplan-avatar myplan-avatar-more">
                            +{trip.participants.length - 6}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="myplan-action-col">
                    {!isCreator && (
                      <button
                        className="myplan-leave-btn"
                        onClick={() => handleLeaveTrip(trip._id)}
                      >
                        Gruptan Ayrıl
                      </button>
                    )}
                    {isCreator && (
                      <div className="myplan-owner-tag">👑 Organizatör</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default MyPlans;
