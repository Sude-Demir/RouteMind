import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      setIsError(false);
      setMessage("Giriş başarılı! Yönlendiriliyorsunuz...");
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err: any) {
      if (err.response && err.response.data.errors) {
        setMessage(err.response.data.errors.map((error: any) => error.msg).join(", "));
      } else {
        setMessage("Bir hata oluştu");
      }
      setIsError(true);
    }
  };

  return (
    <div className="login-page">

      {/* SOL TARAF - FORM */}
      <div className="login-left">
        <div className="login-form-container">
          
          {/* Logo */}
          <div className="login-logo">
            <div className="login-logo-icon">🌍</div>
            <div className="login-logo-text">
              Route<span>mind</span>
            </div>
          </div>

          <h1 className="login-welcome">Tekrar Hoş Geldin</h1>
          <p className="login-subtitle">
            Hesabınıza giriş yapın ve hayalinizdeki rotaları keşfetmeye devam edin.
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            
            <div className="form-group">
              <label htmlFor="email">E-Posta</label>
              <input 
                id="email"
                type="email" 
                name="email" 
                placeholder="ornek@email.com" 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Şifre</label>
              <input 
                id="password"
                type="password" 
                name="password" 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Beni hatırla
              </label>
              <Link to="/" className="forgot-link">Şifremi unuttum?</Link>
            </div>

            <button type="submit" className="login-submit-btn">
              Giriş Yap →
            </button>

            <div className="divider">veya</div>

          </form>

          {message && (
            <div className={`login-message ${isError ? "error" : "success"}`}>
              {message}
            </div>
          )}

          <p className="login-footer">
            Henüz hesabınız yok mu? <Link to="/register">Üye Ol</Link>
          </p>

        </div>
      </div>

      {/* SAĞ TARAF - GÖRSEL */}
      <div className="login-right">
        <img 
          src="https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=1400&q=85&auto=format" 
          alt="Seyahat" 
        />
        <div className="login-right-content">
          <h2>Dünyayı Keşfetmeye<br/>Hazır mısın?</h2>
          <p>
            Yapay zeka destekli rota planlama ile en güzel destinasyonları keşfet.
          </p>
          <div className="login-stats">
            <div className="login-stat">
              <strong>500+</strong>
              <span>Aktif Gezgin</span>
            </div>
            <div className="login-stat">
              <strong>150+</strong>
              <span>Rota</span>
            </div>
            <div className="login-stat">
              <strong>4.9 ⭐</strong>
              <span>Kullanıcı Puanı</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
