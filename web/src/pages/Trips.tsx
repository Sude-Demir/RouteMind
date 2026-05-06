import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Trips.css';

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

const Trips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await api.get('/trips');
      setTrips(res.data);
    } catch (err) {
      setError('Geziler yüklenirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTrip = async (tripId: string) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.put(`/trips/${tripId}/join`);
      setTrips(trips.map(t => t._id === tripId ? res.data : t));
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Bir hata oluştu');
    }
  };

  const handleLeaveTrip = async (tripId: string) => {
    if (!window.confirm('Bu gruptan ayrılmak istediğinize emin misiniz?')) return;
    try {
      const res = await api.put(`/trips/${tripId}/leave`);
      setTrips(trips.map(t => t._id === tripId ? res.data : t));
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Bir hata oluştu');
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Yaklaşan';
      case 'ongoing': return 'Devam Ediyor';
      case 'completed': return 'Tamamlandı';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="trips-page">
        <div className="trips-loading">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="trips-page">
      <div className="trips-header">
        <h1>Geziler ve <span>Gruplar</span></h1>
        <Link to="/trips/create" className="trips-create-btn">
          + Yeni Gezi Grubu Oluştur
        </Link>
      </div>

      {error && <div className="pd-error">{error}</div>}

      {trips.length === 0 ? (
        <div className="trips-empty">
          <h2>Henüz hiç gezi planlanmamış.</h2>
          <p>İlk gezi grubunu sen oluştur ve diğer insanları rotana davet et!</p>
          <Link to="/trips/create" className="trips-create-btn">Hemen Oluştur</Link>
        </div>
      ) : (
        <div className="trips-grid">
          {trips.map((trip) => {
            const isParticipant = currentUser && trip.participants.some(p => p._id === currentUser.id);
            const isCreator = currentUser && trip.creator._id === currentUser.id;
            const isFull = trip.participants.length >= trip.maxParticipants;
            const progress = (trip.participants.length / trip.maxParticipants) * 100;

            return (
              <div key={trip._id} className="trip-card">
                <div className="trip-image-wrap">
                  <img src={trip.imageUrl} alt={trip.title} />
                  <span className={`trip-status ${trip.status}`}>
                    {getStatusText(trip.status)}
                  </span>
                </div>
                
                <div className="trip-body">
                  <div className="trip-destination">📍 {trip.destination}</div>
                  <h3 className="trip-title">{trip.title}</h3>
                  
                  <div className="trip-creator">
                    <div className="trip-creator-avatar">
                      {trip.creator.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="trip-creator-name">
                      <span>Organizatör:</span> {trip.creator.name}
                    </div>
                  </div>

                  <p className="trip-desc">{trip.description}</p>
                  
                  <div className="trip-meta">
                    <div className="trip-meta-item">
                      <span className="trip-meta-label">Başlangıç</span>
                      <span className="trip-meta-value">{formatDate(trip.startDate)}</span>
                    </div>
                    <div className="trip-meta-item">
                      <span className="trip-meta-label">Bitiş</span>
                      <span className="trip-meta-value">{formatDate(trip.endDate)}</span>
                    </div>
                  </div>

                  <div className="trip-progress-container">
                    <div className="trip-progress-info">
                      <span>Katılımcılar</span>
                      <span>{trip.participants.length} / {trip.maxParticipants} Kişi</span>
                    </div>
                    <div className="trip-progress-bar">
                      <div 
                        className={`trip-progress-fill ${isFull ? 'full' : ''}`} 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {isCreator ? (
                    <button className="trip-action-btn leave" disabled>
                      Senin Kurduğun Grup
                    </button>
                  ) : isParticipant ? (
                    <button 
                      className="trip-action-btn leave" 
                      onClick={() => handleLeaveTrip(trip._id)}
                    >
                      Gruptan Ayrıl
                    </button>
                  ) : (
                    <button 
                      className="trip-action-btn join" 
                      onClick={() => handleJoinTrip(trip._id)}
                      disabled={isFull}
                    >
                      {isFull ? 'Grup Dolu' : 'Gruba Katıl'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Trips;
