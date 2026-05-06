import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import './PlaceDetail.css';

interface Comment {
  _id: string;
  user: { _id: string; name: string };
  place: string;
  rating: number;
  title: string;
  text: string;
  imageUrl: string;
  createdAt: string;
}

interface Place {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  images: string[];
  rating: number;
  reviewCount: number;
  routeMindRating: number;
  routeMindReviewCount: number;
  externalComments: {
    _id?: string;
    authorName: string;
    rating: number;
    text: string;
    date: string;
    source: string;
  }[];
  visitDuration: string;
  entranceFee: string;
  openingHours: string;
  address: string;
  latitude: number;
  longitude: number;
  tags: string[];
  isFeatured: boolean;
  city: { _id: string; name: string; code: number; region: string; imageUrl: string };
  country: { _id: string; name: string; code: string; flag: string; imageUrl: string };
}

const CATEGORY_ICONS: Record<string, string> = {
  'Tarihi': '🏛️', 'Doğa': '🌿', 'Müze': '🖼️', 'Plaj': '🏖️',
  'Cami': '🕌', 'Kilise': '⛪', 'Park': '🌳', 'Alışveriş': '🛍️',
  'Yeme-İçme': '🍽️', 'Eğlence': '🎡', 'Spor': '⚽', 'Diğer': '📍',
};

const PlaceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImg, setActiveImg] = useState(0);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');

  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/places/slug/${slug}`);
        setPlace(res.data);
        fetchComments(res.data._id);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Yer bulunamadı.');
        } else {
          setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchPlace();
  }, [slug]);

  const fetchComments = async (placeId: string) => {
    try {
      setCommentsLoading(true);
      const res = await api.get(`/comments/place/${placeId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Yorumlar yüklenemedi", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) {
      setCommentError('Lütfen bir puan seçin.');
      return;
    }
    if (!newText.trim()) {
      setCommentError('Lütfen yorumunuzu yazın.');
      return;
    }

    try {
      setSubmittingComment(true);
      setCommentError('');
      const res = await api.post(`/comments/place/${place?._id}`, {
        rating: newRating,
        title: newTitle,
        text: newText,
        imageUrl: newImageUrl
      });
      
      setComments([res.data, ...comments]);
      
      if (place) {
        const newReviewCount = place.routeMindReviewCount + 1;
        const newAvgRating = ((place.routeMindRating * place.routeMindReviewCount) + newRating) / newReviewCount;
        setPlace({ ...place, routeMindRating: newAvgRating, routeMindReviewCount: newReviewCount });
      }

      setNewRating(0);
      setNewTitle('');
      setNewText('');
      setNewImageUrl('');
    } catch (err: any) {
      setCommentError(err.response?.data?.msg || 'Yorum eklenirken bir hata oluştu.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) stars.push(<span key={i} className="star full">★</span>);
      else if (i - rating < 1) stars.push(<span key={i} className="star half">★</span>);
      else stars.push(<span key={i} className="star empty">☆</span>);
    }
    return stars;
  };

  // ─── Loading ───
  if (loading) {
    return (
      <div className="pd-loading">
        <div className="pd-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  // ─── Error ───
  if (error || !place) {
    return (
      <div className="pd-error">
        <div className="pd-error-icon">😕</div>
        <h2>{error || 'Yer bulunamadı.'}</h2>
        <button className="pd-back-btn" onClick={() => navigate(-1)}>← Geri Dön</button>
      </div>
    );
  }

  const allImages = [
    ...(place.imageUrl ? [place.imageUrl] : []),
    ...(place.images || []),
  ];

  const mapsUrl = `https://www.google.com/maps?q=${place.latitude},${place.longitude}`;

  return (
    <div className="pd-page">
      {/* ── Hero ── */}
      <section
        className="pd-hero"
        style={allImages[activeImg] ? { backgroundImage: `url(${allImages[activeImg]})` } : {}}
      >
        <div className="pd-hero-overlay"></div>
        <div className="pd-hero-content">
          {/* Breadcrumb */}
          <nav className="pd-breadcrumb">
            <span onClick={() => navigate(-1)} style={{ cursor: 'pointer', color: '#f39c12', fontWeight: 600 }}>Keşfet</span>
            <span>›</span>
            <span>{place.country.flag} {place.country.name}</span>
            <span>›</span>
            <span>🏙️ {place.city.name}</span>
            <span>›</span>
            <span>{place.name}</span>
          </nav>

          <div className="pd-hero-badges">
            <span className="pd-hero-cat-badge">
              {CATEGORY_ICONS[place.category]} {place.category}
            </span>
            {place.isFeatured && (
              <span className="pd-hero-featured-badge">✨ Öne Çıkan</span>
            )}
          </div>

          <h1 className="pd-hero-title">{place.name}</h1>
          <p className="pd-hero-subtitle">{place.shortDescription}</p>

          <div className="pd-hero-rating">
            <div className="pd-stars">{renderStars(place.rating)}</div>
            <span className="pd-rating-val">{place.rating.toFixed(1)}</span>
            <span className="pd-review-count">({place.reviewCount.toLocaleString('tr-TR')} değerlendirme)</span>
          </div>
        </div>

        {/* Thumbnail strip */}
        {allImages.length > 1 && (
          <div className="pd-img-strip">
            {allImages.map((img, i) => (
              <button
                key={i}
                className={`pd-img-thumb ${i === activeImg ? 'active' : ''}`}
                onClick={() => setActiveImg(i)}
              >
                <img src={img} alt={`${place.name} ${i + 1}`} />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── Main Content ── */}
      <div className="pd-container">
        <div className="pd-main">

          {/* Left column */}
          <div className="pd-left">
            {/* About */}
            <div className="pd-card">
              <h2 className="pd-card-title">📖 Hakkında</h2>
              <p className="pd-description">{place.description}</p>
            </div>

            {/* Tags */}
            {place.tags.length > 0 && (
              <div className="pd-card">
                <h2 className="pd-card-title">🏷️ Etiketler</h2>
                <div className="pd-tags">
                  {place.tags.map(tag => (
                    <span key={tag} className="pd-tag">#{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="pd-card pd-map-card">
              <h2 className="pd-card-title">🗺️ Konum</h2>
              {place.address && (
                <p className="pd-address">📍 {place.address}</p>
              )}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-map-btn"
              >
                Google Maps'te Aç →
              </a>
              <div className="pd-map-embed">
                <iframe
                  title={`${place.name} harita`}
                  src={`https://maps.google.com/maps?q=${place.latitude},${place.longitude}&z=14&output=embed`}
                  width="100%"
                  height="280"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="pd-sidebar">
            {/* Info card */}
            <div className="pd-info-card">
              <h2 className="pd-info-title">ℹ️ Bilgiler</h2>
              <ul className="pd-info-list">
                <li>
                  <span className="pd-info-label">🎟️ Giriş Ücreti</span>
                  <span className="pd-info-val">{place.entranceFee}</span>
                </li>
                <li>
                  <span className="pd-info-label">⏱️ Ziyaret Süresi</span>
                  <span className="pd-info-val">{place.visitDuration}</span>
                </li>
                {place.openingHours && (
                  <li>
                    <span className="pd-info-label">🕐 Çalışma Saatleri</span>
                    <span className="pd-info-val">{place.openingHours}</span>
                  </li>
                )}
                <li>
                  <span className="pd-info-label">📂 Kategori</span>
                  <span className="pd-info-val">{CATEGORY_ICONS[place.category]} {place.category}</span>
                </li>
                <li>
                  <span className="pd-info-label">🏙️ Şehir</span>
                  <span className="pd-info-val">{place.city.name}</span>
                </li>
                <li>
                  <span className="pd-info-label">🌍 Ülke</span>
                  <span className="pd-info-val">{place.country.flag} {place.country.name}</span>
                </li>
                <li>
                  <span className="pd-info-label">📍 Koordinatlar</span>
                  <span className="pd-info-val" style={{ fontSize: '0.78rem' }}>
                    {place.latitude.toFixed(4)}°, {place.longitude.toFixed(4)}°
                  </span>
                </li>
              </ul>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-directions-btn"
              >
                🧭 Yol Tarifi Al
              </a>
            </div>

            {/* Rating summary */}
            <div className="pd-rating-card">
              <h2 className="pd-info-title">⭐ Değerlendirme</h2>
              
              <div className="pd-rating-split-box">
                <div className="pd-rating-ext">
                  <div className="pd-rating-source">🌐 Dış Kaynak (Google)</div>
                  <div className="pd-rating-big" style={{ fontSize: '2rem' }}>{place.rating.toFixed(1)}</div>
                  <div className="pd-rating-stars">{renderStars(place.rating)}</div>
                  <p className="pd-rating-reviews">{place.reviewCount.toLocaleString('tr-TR')} değerlendirme</p>
                </div>
                
                <div className="pd-rating-int" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f5f0ea' }}>
                  <div className="pd-rating-source">💬 RouteMind Topluluğu</div>
                  <div className="pd-rating-big" style={{ fontSize: '2rem', color: '#3a7a6a' }}>{place.routeMindRating.toFixed(1)}</div>
                  <div className="pd-rating-stars">{renderStars(place.routeMindRating)}</div>
                  <p className="pd-rating-reviews">{place.routeMindReviewCount.toLocaleString('tr-TR')} değerlendirme</p>
                </div>
              </div>
            </div>

            {/* Back button */}
            <button
              className="pd-back-to-list-btn"
              onClick={() => navigate(-1)}
            >
              ← Listeye Dön
            </button>
          </aside>
        </div>

        {/* ── Comments Section ── */}
        <section className="pd-comments-section">
          <h2 className="pd-comments-title">💬 Yorumlar</h2>
          
          <div className="pd-comments-layout">
            <div className="pd-comments-list">
              
              {/* External Comments */}
              {place.externalComments && place.externalComments.length > 0 && (
                <div className="pd-external-comments-wrapper" style={{ marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#6b5e50', marginBottom: '16px', borderBottom: '1px solid #ebe5dc', paddingBottom: '8px' }}>🌐 Dış Kaynaklardan Gelen Yorumlar</h3>
                  {place.externalComments.map((extComment, idx) => (
                    <div key={`ext-${idx}`} className="pd-comment-card" style={{ backgroundColor: '#faf8f5', marginBottom: '16px' }}>
                      <div className="pd-comment-header">
                        <div className="pd-comment-user">
                          <span className="pd-comment-avatar" style={{ background: '#4285F4' }}>{extComment.authorName.charAt(0)}</span>
                          <div>
                            <strong>{extComment.authorName}</strong>
                            <div style={{ fontSize: '0.75rem', color: '#9e8e7e', marginTop: '2px' }}>{extComment.source}</div>
                          </div>
                        </div>
                        <div className="pd-comment-meta">
                          <div className="pd-comment-stars">{renderStars(extComment.rating)}</div>
                          <span className="pd-comment-date">{extComment.date}</span>
                        </div>
                      </div>
                      <p className="pd-comment-text">{extComment.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* RouteMind Comments */}
              <div className="pd-routemind-comments-wrapper">
                <h3 style={{ fontSize: '1.1rem', color: '#1a3c34', marginBottom: '16px', borderBottom: '1px solid #ebe5dc', paddingBottom: '8px' }}>💬 RouteMind Kullanıcı Yorumları ({place.routeMindReviewCount})</h3>
                {commentsLoading ? (
                  <p>Yorumlar yükleniyor...</p>
                ) : comments.length === 0 ? (
                  <p className="pd-no-comments">Henüz RouteMind kullanıcısı yorum yapmamış. İlk yorumu siz yapın!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="pd-comment-card" style={{ marginBottom: '16px' }}>
                      <div className="pd-comment-header">
                        <div className="pd-comment-user">
                          <span className="pd-comment-avatar">{comment.user.name.charAt(0).toUpperCase()}</span>
                          <strong>{comment.user.name}</strong>
                        </div>
                        <div className="pd-comment-meta">
                          <div className="pd-comment-stars">{renderStars(comment.rating)}</div>
                          <span className="pd-comment-date">{new Date(comment.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                      {comment.title && <h4 className="pd-comment-title">{comment.title}</h4>}
                      <p className="pd-comment-text">{comment.text}</p>
                      {comment.imageUrl && (
                        <div className="pd-comment-image-wrapper">
                          <img src={comment.imageUrl} alt="Yorum görseli" className="pd-comment-image" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pd-comment-form-container">
              <h3 className="pd-comment-form-title">Yorum Yap</h3>
              {isLoggedIn ? (
                <form className="pd-comment-form" onSubmit={handleCommentSubmit}>
                  {commentError && <div className="pd-comment-error">{commentError}</div>}
                  
                  <div className="pd-form-group">
                    <label>Puanınız *</label>
                    <div className="pd-rating-select">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                          key={star} 
                          className={`pd-star-select ${star <= newRating ? 'active' : ''}`}
                          onClick={() => setNewRating(star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pd-form-group">
                    <label>Başlık (Opsiyonel)</label>
                    <input 
                      type="text" 
                      placeholder="Yorumunuzu özetleyen kısa bir başlık" 
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      maxLength={100}
                    />
                  </div>

                  <div className="pd-form-group">
                    <label>Yorum *</label>
                    <textarea 
                      placeholder="Deneyimlerinizi paylaşın..." 
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      rows={4}
                      maxLength={1000}
                    ></textarea>
                  </div>

                  <div className="pd-form-group">
                    <label>Görsel Linki (Opsiyonel)</label>
                    <input 
                      type="text" 
                      placeholder="https://..." 
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="pd-submit-btn" 
                    disabled={submittingComment}
                  >
                    {submittingComment ? 'Gönderiliyor...' : 'Yorumu Gönder'}
                  </button>
                </form>
              ) : (
                <div className="pd-login-prompt">
                  <p>Yorum yapabilmek için giriş yapmalısınız.</p>
                  <Link to="/login" className="pd-login-link">Giriş Yap</Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PlaceDetail;
