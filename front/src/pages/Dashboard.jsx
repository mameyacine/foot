import { useEffect, useState } from "react";
import Match from "../components/Match";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("championships");
  const [selectedChampionship, setSelectedChampionship] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [results, setResults] = useState([]);

  const [data, setData] = useState({
    countries: [],
    championships: [],
    teams: [],
    matchdays: [],
    teamCounts: {}
  });

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [countriesRes, championshipsRes, teamsRes, matchdaysRes, resultsRes] = await Promise.all([
          api.get("/countries", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/championships", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/teams", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/days", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/games")
        ]);

        const teamCounts = {};
        await Promise.all(
          championshipsRes.data.map(async (champ) => {
            try {
              const res = await api.get(
                `/teamChampionships/championship/${champ._id}/teams/count`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              teamCounts[champ._id] = res.data.teamCount;
            } catch (err) {
              console.error(`Erreur pour ${champ.name}:`, err);
              teamCounts[champ._id] = 0;
            }
          })
        );

        setData({
          countries: countriesRes.data,
          championships: championshipsRes.data,
          teams: teamsRes.data,
          matchdays: matchdaysRes.data,
          teamCounts
        });

        setResults(resultsRes.data);
        console.log("Résultats bruts :", resultsRes.data);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const getCountryName = (countryId) =>
    data.countries.find(c => c._id === countryId)?.name || "Inconnu";
const getMatchDay = (IdDay) => {
  const number = data.matchdays.find(day => day._id === IdDay)?.number;
  return number !== undefined ? `Journée ${number}` : "Journée inconnue";
};
  const getTeamsByChampionship = (championshipId) => {
    const teamIds = new Set(
      data.matchdays
        .filter(m => m.championshipId === championshipId)
        .flatMap(m => [m.team1Id, m.team2Id])
    );
    return data.teams.filter(team => teamIds.has(team._id));
  };

  const getLatestResults = () => {
    const pastMatches = results.filter(result => new Date(result.dateMatch) < new Date());
    return pastMatches
      .sort((a, b) => new Date(b.dateMatch) - new Date(a.dateMatch))
      .slice(0, 5);
  };
const getTeamName = (teamIdOrObj) => {
  if (!teamIdOrObj) return "Équipe inconnue";
  if (typeof teamIdOrObj === "string") {
    return data.teams.find(team => team._id === teamIdOrObj)?.name || "Équipe inconnue";
  }
  // Si c'est un objet complet avec une propriété name
  if (teamIdOrObj.name) {
    return teamIdOrObj.name;
  }
  return "Équipe inconnue";
};

  if (!token) {
    return (
      <div className="auth-message">
        <h2>Connectez-vous pour accéder au tableau de bord</h2>
        <p>Veuillez vous connecter pour voir les données</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement en cours...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">


      <main className="main-content">
        {activeView === "championships" && (
          <div className="overview">
            <h2>Tous les championnats</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Championnats</h3>
                <p>{data.championships.length}</p>
              </div>

              <div className="stat-card">
                <h3>Pays</h3>
                <p>{data.countries.length}</p>
              </div>
              
              
              <div className="stat-card">
                <h3>Équipes</h3>
                <p>{data.teams.length}</p>
              </div>
              <div className="stat-card">
                <h3>Journées</h3>
                <p>{data.matchdays.length}</p>
              </div>
            </div>

<div className="results-section">
  <h3>Tous les matchs</h3>
  <div className="match-list">
    {results.length > 0 ? (
      results
        .sort((a, b) => new Date(b.dateMatch) - new Date(a.dateMatch)) // Tri du plus récent au plus ancien
        .map(result => (
          <Match
            key={result._id}
            result={result}
            getTeamName={getTeamName}
              getMatchDay={getMatchDay}

          />
        ))
    ) : (
      <p>Aucun match disponible.</p>
    )}
  </div>
</div>
          </div>
        )}

        {activeView === "championship-detail" && selectedChampionship && (
          <div className="championship-detail">
            <h2>{selectedChampionship.name}</h2>
            <div className="championship-info">
              <p><strong>Pays:</strong> {getCountryName(selectedChampionship.countryId)}</p>
              <p><strong>Nombre d'équipes:</strong> {data.teamCounts[selectedChampionship._id] || 0}</p>
              <p><strong>Nombre de journées:</strong> {
                data.matchdays.filter(m => m.championshipId === selectedChampionship._id).length
              }</p>
            </div>

            <h3>Équipes participantes</h3>
            <div className="participating-teams">
              {getTeamsByChampionship(selectedChampionship._id).map(team => (
                <div key={team._id} className="team-card">
                  <div className="team-logo-placeholder">
                    {team.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="team-info">
                    <h4>{team.name}</h4>
                    <p>{getCountryName(team.countryId)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === "team-detail" && selectedTeam && (
          <div className="team-detail">
            <div className="team-header">
              <div className="team-logo-placeholder large">
                {selectedTeam.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2>{selectedTeam.name}</h2>
                <p className="team-country">{getCountryName(selectedTeam.countryId)}</p>
              </div>
            </div>

            <h3>Championnats participés</h3>
            <div className="championships-list">
              {data.championships
                .filter(champ =>
                  data.matchdays.some(m =>
                    m.championshipId === champ._id &&
                    (m.team1Id === selectedTeam._id || m.team2Id === selectedTeam._id)
                  )
                )
                .map(champ => (
                  <div key={champ._id} className="championship-card">
                    <h4>{champ.name}</h4>
                    <p>{getCountryName(champ.countryId)}</p>
                    <p>{data.teamCounts[champ._id] || 0} équipes</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}