import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- ajoute cette ligne
import { useAuth } from "../context/AuthContext";
import api from "../services/api"; // ajuste le chemin si besoin
import "./AuthForm.css";


export default function AuthForm() {
    const navigate = useNavigate();  // <-- initialise ici

  const [activeTab, setActiveTab] = useState("signup");
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  console.log("handleSubmit called", activeTab, formData);

  if (activeTab === "signup") {
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

   try {
  const response = await api.post("/auth/register", {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    password: formData.password,
  });

  console.log("Inscription réussie", response.data);

  // Au lieu de login automatique, on passe à l'onglet connexion
  alert("Inscription réussie, vous pouvez maintenant vous connecter.");
  setActiveTab("login");

  // Optionnel : reset formData pour éviter confusion
  setFormData({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

} catch (error) {
  console.error("Erreur inscription :", error.response?.data || error.message);
  alert("Erreur lors de l'inscription : " + (error.response?.data?.message || error.message));
} 

  } else {
    // Connexion
    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Connexion réussie", response.data);
      login(response.data.token);
        navigate("/home");  // redirection après connexion


    } catch (error) {
      console.error("Erreur connexion :", error.response?.data || error.message);
      alert("Erreur lors de la connexion : " + (error.response?.data?.message || error.message));
    }
  }
};

  return (
    <div className="form">
      <ul className="tab-group">
        <li className={activeTab === "signup" ? "active" : ""}>
          <button type="button" onClick={() => setActiveTab("signup")}>S'inscrire</button>
        </li>
        <li className={activeTab === "login" ? "active" : ""}>
          <button type="button" onClick={() => setActiveTab("login")}>Se connecter</button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === "signup" ? (
          <div id="signup">
            <h1>S'inscrire gratuitement</h1>
            <form onSubmit={handleSubmit}>
              <div className="top-row">
                <div className="field-wrap">
                  <label>Prénom<span className="req">*</span></label>
                  <input 
                    type="text" 
                    name="firstName"
                    required 
                    autoComplete="off" 
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onChange={handleChange}
                    value={formData.firstName}
                  />
                </div>
                <div className="field-wrap">
                  <label>Nom<span className="req">*</span></label>
                  <input 
                    type="text" 
                    name="lastName"
                    required 
                    autoComplete="off" 
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onChange={handleChange}
                    value={formData.lastName}
                  />
                </div>
              </div>
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

            <div className="field-wrap password-field">
              <label>Répéter le mot de passe<span className="req">*</span></label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                autoComplete="off"
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onChange={handleChange}
                value={formData.confirmPassword}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(prev => !prev)}
                aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
              <button type="submit" className="button">Inscription</button>
            </form>
          </div>
        ) : (
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
              <p className="forgot"><a href="#">Mot de passe oublié?</a></p>
              <button type="submit" className="button">Connexion</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}