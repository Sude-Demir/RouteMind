import React, { useState } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : { name: "Misafir", email: "misafir@routemind.com" };

  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h1 className="sidebar-title">Kontrol Paneli</h1>
        <ul className="sidebar-menu">
          <li 
            className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Genel Bakış
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profil Bilgileri
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🔒 Güvenlik & Şifre
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'plans' ? 'active' : ''}`}
            onClick={() => setActiveTab('plans')}
          >
            📅 Planlarım
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            ❤️ Favorilerim
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <header className="admin-header">
              <h2>Hoş Geldin, {user.name} 👋</h2>
              <p>Bugün rotalarını yönetmek için harika bir gün.</p>
            </header>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Favori Rotalar</h3>
                <div className="stat-value">12</div>
              </div>
              <div className="stat-card">
                <h3>Tamamlanan Geziler</h3>
                <div className="stat-value">8</div>
              </div>
              <div className="stat-card">
                <h3>Planlanan Geziler</h3>
                <div className="stat-value">3</div>
              </div>
              <div className="stat-card">
                <h3>Hesap Türü</h3>
                <div className="stat-value" style={{fontSize: '1.2rem'}}>Gezgin (Premium)</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="tab-content">
            <header className="admin-header">
              <h2>Profil Bilgileri</h2>
              <p>Kişisel bilgilerinizi buradan güncelleyebilirsiniz.</p>
            </header>
            
            <div className="content-section">
              <div className="info-group">
                <label>Ad Soyad</label>
                <input 
                  type="text" 
                  value={profileData.name} 
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                />
              </div>
              <div className="info-group">
                <label>E-Posta Adresi</label>
                <input 
                  type="email" 
                  value={profileData.email} 
                  disabled
                />
                <small style={{color: '#9a8e80', marginTop: '5px', display: 'block'}}>
                  E-posta adresi güvenliğiniz için değiştirilemez.
                </small>
              </div>
              <button className="save-btn">Bilgileri Güncelle</button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="tab-content">
            <header className="admin-header">
              <h2>Güvenlik Ayarları</h2>
              <p>Hesap güvenliğiniz için şifre güncellemelerini buradan yapın.</p>
            </header>
            
            <div className="content-section">
              <div className="info-group">
                <label>Mevcut Şifre</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                />
              </div>
              <div className="info-group">
                <label>Yeni Şifre</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                />
              </div>
              <div className="info-group">
                <label>Yeni Şifre (Tekrar)</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                />
              </div>
              <button className="save-btn">Şifreyi Güncelle</button>
            </div>
          </div>
        )}

        {(activeTab === 'plans' || activeTab === 'favorites') && (
          <div className="tab-content" style={{textAlign: 'center', paddingTop: '50px'}}>
            <div style={{fontSize: '3rem', marginBottom: '20px'}}>🏗️</div>
            <h2>Pek Yakında!</h2>
            <p>Bu bölüm şu an geliştirme aşamasındadır.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
