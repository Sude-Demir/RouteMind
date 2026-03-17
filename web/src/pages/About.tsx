import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-bg">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2000&q=90&auto=format" 
          alt="Dağ Manzarası" 
        />
        <div className="about-overlay"></div>
      </div>

      <div className="about-content">
        <h1>Hakkımızda</h1>
        <p>
          RouteMind olarak, karmaşık lojistik süreçlerini sadeleştiriyor ve akıllı algoritmalarımızla en optimum rotaları oluşturuyoruz. 
          Amacımız; zaman, yakıt ve iş gücü maliyetlerini minimize ederek işletmelerin daha sürdürülebilir ve verimli büyümesine katkı sağlamaktır.
        </p>
        <p>
          Gelişmiş veri analizi ve yapay zeka destekli altyapımız ile sadece bir yazılım değil, aynı zamanda güvenilir bir çözüm ortağı sunuyoruz. 
          Güvenlik, hız ve teknolojiyi tek bir merkezde, yani RouteMind'da birleştiriyoruz.
        </p>

        <div className="about-stats">
          <div className="about-stat-item">
            <span className="about-stat-number">100%</span>
            <span className="about-stat-label">Güvenilir</span>
          </div>
          <div className="about-stat-item">
            <span className="about-stat-number">24/7</span>
            <span className="about-stat-label">Destek</span>
          </div>
          <div className="about-stat-item">
            <span className="about-stat-number">YZ</span>
            <span className="about-stat-label">Teknolojisi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

