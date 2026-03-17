import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-wrapper">

      {/* ===== HERO BÖLÜMÜ ===== */}
      <section className="hero-section">
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=2000&q=90&auto=format" alt="Hayalindeki gezi" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Hayalindeki Geziyi<br />Keşfet ve Planla
          </h1>
          <p className="hero-subtitle">Nereye Gitmek İstiyorsun?</p>
          <div className="search-bar">
            <div className="search-field">
              <span className="field-icon">📍</span>
              <span className="field-text">Destinasyon</span>
            </div>
            <div className="search-field">
              <span className="field-icon">📅</span>
              <span className="field-text">Tarih</span>
            </div>
            <div className="search-field">
              <span className="field-icon">👥</span>
              <span className="field-text">Yolcu Sayısı</span>
            </div>
            <button className="search-btn">Keşfet</button>
          </div>
        </div>
      </section>

      {/* ===== POPÜLER ROTALAR ===== */}
      <section className="routes-section">
        <div className="routes-header">
          <h2>Popüler Rotalar</h2>
          <div className="routes-nav">
            <button>‹</button>
            <button>›</button>
          </div>
        </div>
        <div className="routes-grid">

          {/* Kart 1 - Safari */}
          <div className="route-card">
            <div className="card-image">
              <img src="/images/safari.png" alt="Safari Macerası" />
              <button className="card-heart">♥</button>
            </div>
            <div className="card-body">
              <h3>Safari Macerası: Vahşi Yaşamın Kalbi</h3>
              <div className="card-meta">
                <div className="card-info">
                  <span>🕐 10 gün</span>
                  <span>⭐ Puan: 4.8</span>
                </div>
                <Link to="/" className="card-link">Keşfet</Link>
              </div>
            </div>
          </div>

          {/* Kart 2 - Akdeniz */}
          <div className="route-card">
            <div className="card-image">
              <img src="/images/amalfi.png" alt="Akdeniz Rüyası" />
              <button className="card-heart">♥</button>
            </div>
            <div className="card-body">
              <h3>Akdeniz Rüyası: Positano & Amalfi</h3>
              <div className="card-meta">
                <div className="card-info">
                  <span>🕐 7 gün</span>
                  <span>⭐ Puan: 4.9</span>
                </div>
                <Link to="/" className="card-link">Keşfet</Link>
              </div>
            </div>
          </div>

          {/* Kart 3 - Kuzey Işıkları */}
          <div className="route-card">
            <div className="card-image">
              <img src="/images/northern-lights.png" alt="Kuzey Işıkları" />
              <button className="card-heart">♥</button>
            </div>
            <div className="card-body">
              <h3>Kuzey Işıkları: Arktik Masal</h3>
              <div className="card-meta">
                <div className="card-info">
                  <span>🕐 5 gün</span>
                  <span>⭐ Puan: 4.7</span>
                </div>
                <Link to="/" className="card-link">Keşfet</Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ===== NEDEN BİZ ===== */}
      <section className="why-section">
        <div className="why-container">
          <h2>Neden RouteMind?</h2>
          <div className="why-grid">
            <div className="why-card">
              <span className="why-icon">🧠</span>
              <h3>Yapay Zeka ile Planlama</h3>
              <p>Akıllı algoritmalarımız sizin için en optimum rotayı saniyeler içinde hesaplar.</p>
            </div>
            <div className="why-card">
              <span className="why-icon">🗺️</span>
              <h3>Kişiselleştirilmiş Rotalar</h3>
              <p>İlgi alanlarınıza, bütçenize ve zamanınıza göre size özel rotalar oluşturulur.</p>
            </div>
            <div className="why-card">
              <span className="why-icon">💬</span>
              <h3>Topluluk Deneyimleri</h3>
              <p>Binlerce gezginin deneyim ve önerilerinden ilham alarak yolculuğunuzu planlayın.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NASIL ÇALIŞIR ===== */}
      <section className="howto-section">
        <div className="howto-container">
          <h2>Nasıl Çalışır?</h2>
          <div className="howto-steps">
            <div className="howto-step">
              <div className="step-circle">1</div>
              <h3>Üye Ol</h3>
              <p>Hızlıca hesabını oluştur ve RouteMind dünyasına katıl.</p>
            </div>
            <div className="howto-step">
              <div className="step-circle">2</div>
              <h3>Rotanı Keşfet</h3>
              <p>Gitmek istediğin yeri ara, filtreleri kullan ve en ideal rotayı bul.</p>
            </div>
            <div className="howto-step">
              <div className="step-circle">3</div>
              <h3>Yola Çık!</h3>
              <p>Planını kaydet, paylaş ve unutulmaz seyahatine başla.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <h2 className="cta-title">Hayalindeki Rotayı Keşfetmeye Hazır mısın?</h2>
        <p className="cta-desc">
          Hemen ücretsiz üye ol ve RouteMind'ın akıllı rota önerilerini keşfetmeye başla.
        </p>
        <Link to="/register" className="cta-btn">Hemen Başla →</Link>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        © 2026 RouteMind. Tüm hakları saklıdır.
      </footer>

    </div>
  );
};

export default Home;
