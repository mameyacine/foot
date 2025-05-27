import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./AuthForm.css";

export default function AuthForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputFocus = (e) => {
    e.target.previousElementSibling.classList.add('active');
  };

  const handleInputBlur = (e) => {
    if (e.target.value === '') {
      e.target.previousElementSibling.classList.remove('active');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      login(response.data.token);
      navigate("/home");
    } catch (error) {
      console.error("Erreur connexion :", error.response?.data || error.message);
      alert("Erreur lors de la connexion : " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="form">
      <div className="tab-content">
        <div id="login">
          <h1>Connectez-vous</h1>
          <form onSubmit={handleSubmit}>
            <div className="field-wrap">
              <label>Email<span className="req">*</span></label>
              <input 
                type="email" 
                name="email"
                required 
                autoComplete="off" 
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onChange={handleChange}
                value={formData.email}
              />
            </div>

            <div className="field-wrap password-field">
              <label>Mot de passe<span className="req">*</span></label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                autoComplete="off"
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onChange={handleChange}
                value={formData.password}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <p className="forgot"><a href="#">Mot de passe oublié ?</a></p>
            <button type="submit" className="button">Connexion</button>
          </form>
        </div>
      </div>
    </div>
  );
}