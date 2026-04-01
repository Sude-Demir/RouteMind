import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { validatePassword } from "../utils/validation";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
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

    // Frontend validation
    const { isValid } = validatePassword(formData.password);
    if (!isValid) {
      setMessage("Şifre en az 8 karakter olmalı, bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter (@$!%*?&._-#/%^*+) içermelidir.");
      setIsError(true);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      setMessage(res.data.msg);
      setIsError(false);
      setFormData({ name: "", email: "", password: "" });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

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
    <div className="register-page">

      {/* SOL TARAF - FORM */}
      <div className="register-left">
        <div className="register-form-container">
          
          {/* Logo */}
          <div className="register-logo">
            <div className="register-logo-icon">✈️</div>
            <div className="register-logo-text">
              Route<span>mind</span>
            </div>
          </div>

          <h1 className="register-welcome">Maceraya Katıl 🌍</h1>
          <p className="register-subtitle">
            Ücretsiz hesap oluştur ve en güzel rotaları keşfetmeye başla.
          </p>

          <form onSubmit={handleSubmit} className="register-form">
            
            <div className="form-group">
              <label htmlFor="name">Ad Soyad</label>
              <input 
                id="name"
                type="text" 
                name="name" 
                placeholder="Adınız ve Soyadınız" 
                value={formData.name} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">E-Posta</label>
              <input 
                id="reg-email"
                type="email" 
                name="email" 
                placeholder="ornek@email.com" 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="reg-password">Şifre</label>
              <input 
                id="reg-password"
                type="password" 
                name="password" 
                placeholder="Şifrenizi girin" 
                value={formData.password} 
                onChange={handleChange} 
              />
            </div>

            <button type="submit" className="register-submit-btn">
              Üye Ol →
            </button>
          </form>

          {message && (
            <div className={`register-message ${isError ? "error" : "success"}`}>
              {message}
            </div>
          )}

          <p className="register-footer">
            Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
          </p>

        </div>
      </div>

      {/* SAĞ TARAF - GÖRSEL */}
      <div className="register-right">
        <img 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=85&auto=format" 
          alt="Keşfet" 
        />
        <div className="register-right-content">
          <h2>Yeni Rotalar<br/>Seni Bekliyor</h2>
          <p>
            RouteMind ile yapay zeka destekli rotalarını planla, keşfet ve paylaş.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Register;
