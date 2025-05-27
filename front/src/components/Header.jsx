import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

const baseUrl = "http://localhost:8080";

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [championships, setChampionships] = useState([]);
  const [teams, setTeams] = useState([]);

  const navigate = useNavigate();
  const { isLoggedIn, logout, token } = useAuth();

  const isMobile = () => window.innerWidth <= 768;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const fetchWithToken = async (url) => {
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const fetchChampionships = async () => {
    if (championships.length === 0) {
      const data = await fetchWithToken(`${baseUrl}/api/championships`);
      setChampionships(data);
    }
  };

  const fetchTeams = async () => {
    if (teams.length === 0) {
      const data = await fetchWithToken(`${baseUrl}/api/teams`);
      setTeams(data);
    }
  };

  const toggleDropdown = (dropdownName) => {
    const isOpen = openDropdown === dropdownName;
    setOpenDropdown(isOpen ? null : dropdownName);

    if (!isOpen) {
      if (dropdownName === "championships") fetchChampionships();
      if (dropdownName === "teams") fetchTeams();
    }
  };

  useEffect(() => {
    // Pré-chargement sur desktop au hover
    if (!isMobile() && openDropdown === "championships") fetchChampionships();
    if (!isMobile() && openDropdown === "teams") fetchTeams();
  }, [openDropdown]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && !e.target.closest(".nav-links") && !e.target.closest(".menu-toggle")) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <header className="modern-header">
      <nav className="nav-container">
        <Link to="/home" className="brand" onClick={() => setMobileMenuOpen(false)}>
          ⚽ <span>Football Champs</span>
        </Link>

        <button className="menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        <div className={`mobile-overlay ${mobileMenuOpen ? "open" : ""}`} onClick={() => setMobileMenuOpen(false)} />

        <ul className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
{/* Championnats */}
<li
  className="dropdown"
  onMouseEnter={() => !isMobile() && setOpenDropdown("championships")}
  onMouseLeave={() => !isMobile() && setOpenDropdown(null)}
>
  <span
    className={`dropdown-label ${openDropdown === "championships" ? "open" : ""}`}
    onClick={() => isMobile() && toggleDropdown("championships")}
  >
    Championnats
  </span>

  {isMobile() ? (
    <ul className={`inline-list ${openDropdown === "championships" ? "open" : ""}`}>
      {championships.length === 0 ? (
        <li>Chargement...</li>
      ) : (
        championships.map((champ) => (
          <li key={champ._id}>
            <Link to={`/championships/${champ._id}`} onClick={() => setMobileMenuOpen(false)}>
              {champ.name}
            </Link>
          </li>
        ))
      )}
    </ul>
  ) : (
    <ul className="dropdown-menu">
      {championships.length === 0 ? (
        <li>Chargement...</li>
      ) : (
        championships.map((champ) => (
          <li key={champ._id}>
            <Link to={`/championships/${champ._id}`}>{champ.name}</Link>
          </li>
        ))
      )}
    </ul>
  )}
</li>

{/* Équipes */}
<li
  className="dropdown"
  onMouseEnter={() => !isMobile() && setOpenDropdown("teams")}
  onMouseLeave={() => !isMobile() && setOpenDropdown(null)}
>
  <span
    className={`dropdown-label ${openDropdown === "teams" ? "open" : ""}`}
    onClick={() => isMobile() && toggleDropdown("teams")}
  >
    Équipes
  </span>

  {isMobile() ? (
    <ul className={`inline-list ${openDropdown === "teams" ? "open" : ""}`}>
      {teams.length === 0 ? (
        <li>Chargement...</li>
      ) : (
        teams.map((team) => (
          <li key={team._id}>
            <Link to={`/teams/${team._id}`} onClick={() => setMobileMenuOpen(false)}>
              {team.name}
            </Link>
          </li>
        ))
      )}
    </ul>
  ) : (
    <ul className="dropdown-menu">
      {teams.length === 0 ? (
        <li>Chargement...</li>
      ) : (
        teams.map((team) => (
          <li key={team._id}>
            <Link to={`/teams/${team._id}`}>{team.name}</Link>
          </li>
        ))
      )}
    </ul>
  )}
</li>

          <li className="auth-button">
            {isLoggedIn ? (
              <button className="logout-button" onClick={handleLogout}>
                Déconnexion
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <button className="login-button">Connexion</button>
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;