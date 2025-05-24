import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Header.css";

const baseUrl = "http://localhost:8080"; // URL de ton backend

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const [championships, setChampionships] = useState([]);
  const [teams, setTeams] = useState([]);
  const [games, setGames] = useState([]);
  const [days, setDays] = useState([]);

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("authChanged")); // notifier le changement d'état
    navigate("/login");
  };

  const fetchWithToken = async (url) => {
    const res = await fetch(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    if (!res.ok) {
      console.error("Erreur API:", res.status);
      return [];
    }
    return await res.json();
  };

  const fetchChampionships = async () => {
    const data = await fetchWithToken(`${baseUrl}/api/championships`);
    setChampionships(data);
  };

  const fetchTeams = async () => {
    const data = await fetchWithToken(`${baseUrl}/api/teams`);
    setTeams(data);
  };

  const fetchGames = async () => {
    const data = await fetchWithToken(`${baseUrl}/api/games`);
    setGames(data);
  };

  const fetchDays = async () => {
    const data = await fetchWithToken(`${baseUrl}/api/days`);
    setDays(data);
  };

  useEffect(() => {
    if (openDropdown === "championships" && championships.length === 0) {
      fetchChampionships();
    } else if (openDropdown === "teams" && teams.length === 0) {
      fetchTeams();
    } else if (openDropdown === "games" && games.length === 0) {
      fetchGames();
    } else if (openDropdown === "days" && days.length === 0) {
      fetchDays();
    }
  }, [openDropdown]);

  // Mettre à jour l'état de connexion lors du chargement et sur changement
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth(); // au chargement
    window.addEventListener("authChanged", checkAuth); // écoute les changements

    return () => {
      window.removeEventListener("authChanged", checkAuth);
    };
  }, []);

  return (
    <header className="modern-header">
      <nav className="nav-container">
        <Link to="/home" className="brand">
          ⚽ <span>Football Champs</span>
        </Link>

        <ul className="nav-links">
          {/* Championnats */}
          <li
            className="dropdown"
            onMouseEnter={() => setOpenDropdown("championships")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <span className="dropdown-label">Championnats</span>
            {openDropdown === "championships" && (
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
            onMouseEnter={() => setOpenDropdown("teams")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <span className="dropdown-label">Équipes</span>
            {openDropdown === "teams" && (
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

          {/* Journées */}
          <li
            className="dropdown"
            onMouseEnter={() => setOpenDropdown("days")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <span className="dropdown-label">Journées</span>
            {openDropdown === "days" && (
              <ul className="dropdown-menu">
                {days.length === 0 ? (
                  <li>Chargement...</li>
                ) : (
                  days.map((day) => (
                    <li key={day._id}>
                      <Link to={`/days/${day._id}`}>{day.name}</Link>
                    </li>
                  ))
                )}
              </ul>
            )}
          </li>

          <li className="auth-button">
            {isLoggedIn ? (
              <button onClick={handleLogout}>Déconnexion</button>
            ) : (
              <Link to="/login">
                <button>Connexion</button>
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;