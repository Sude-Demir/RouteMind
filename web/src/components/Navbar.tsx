import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const navLinkStyle = (path: string) => ({
    margin: "0 14px",
    textDecoration: "none",
    color: location.pathname === path ? "#2c2c2c" : "#8c7e6f",
    fontWeight: location.pathname === path ? "600" as const : "500" as const,
    fontSize: "0.9rem",
    transition: "color 0.3s"
  });

  return (
    <nav style={{ 
      padding: "14px 30px", 
      backgroundColor: "#faf8f5", 
      display: "flex", 
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #ebe5dc",
      position: "sticky",
      top: 0,
      zIndex: 1100
    }}>
      {/* Sol - Logo */}
      <div style={{ display: "flex", alignItems: "center", zIndex: 1101 }}>
        <Link to="/" className="custom-logo-container" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="custom-logo-text">
                Route<span className="custom-mind-part">mind</span>
            </div>
        </Link>
      </div>

      {/* Orta - Desktop Linkler */}
      <div className="nav-desktop-links" style={{ 
        display: "flex", 
        alignItems: "center", 
        background: "#fff", 
        padding: "8px 24px", 
        borderRadius: "30px",
        boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
        border: "1px solid #ebe5dc"
      }}>
        <Link to="/" style={navLinkStyle("/")}>Ana Sayfa</Link>
        <Link to="/about" style={navLinkStyle("/about")}>Hakkımızda</Link>
        <Link to="/" style={navLinkStyle("/rotalar")}>Rotalar</Link>
        <Link to="/" style={navLinkStyle("/kesfet")}>Keşfet</Link>
        <Link to="/" style={navLinkStyle("/planla")}>Planla</Link>
      </div>

      {/* Sağ - Kullanıcı & Hamburger */}
      <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        
        {/* Desktop User Dropdown */}
        <div className="nav-right-desktop">
          {user ? (
            <div className="nav-user-container desktop">
              <div className="nav-user-trigger">
                👤 {user.name}
              </div>
              
              <div className="nav-user-dropdown">
                <Link to="/admin" className="nav-dropdown-item admin">
                  🛡️ Admin Paneli
                </Link>
                <Link to="/" className="nav-dropdown-item">
                  ❤️ Favorilerim
                </Link>
                <Link to="/" className="nav-dropdown-item">
                  📅 Planlarım
                </Link>
                <div className="nav-dropdown-divider"></div>
                <div 
                  className="nav-dropdown-item logout" 
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  🚪 Çıkış Yap
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" style={{ 
              textDecoration: "none", 
              color: "#6b5e50", 
              fontWeight: "600", 
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              👤 Giriş Yap
            </Link>
          )}
        </div>

        {/* Hamburger Menu Icon */}
        <button 
          className="nav-mobile-menu-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`nav-mobile-overlay ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="nav-mobile-links">
          <Link to="/" className="nav-mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Ana Sayfa</Link>
          <Link to="/about" className="nav-mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Hakkımızda</Link>
          <Link to="/" className="nav-mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Rotalar</Link>
          <Link to="/" className="nav-mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Keşfet</Link>
          <Link to="/" className="nav-mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Planla</Link>
        </div>

        <div className="nav-mobile-user">
          {user ? (
            <>
              <div style={{ color: "#1a3c34", fontWeight: "700", fontSize: "1.2rem", marginBottom: "15px" }}>
                👤 {user.name}
              </div>
              <Link to="/admin" className="nav-mobile-link" style={{ fontSize: "1.1rem", borderBottom: "none" }} onClick={() => setIsMobileMenuOpen(false)}>🛡️ Admin Paneli</Link>
              <div 
                className="nav-mobile-link" 
                style={{ fontSize: "1.1rem", color: "#c0392b", marginTop: "20px" }}
                onClick={handleLogout}
              >
                🚪 Çıkış Yap
              </div>
            </>
          ) : (
            <Link to="/login" className="nav-mobile-link" onClick={() => setIsMobileMenuOpen(false)}>👤 Giriş Yap</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

