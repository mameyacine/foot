import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Match from "../components/Match";
import { useAuth } from "../context/AuthContext"; // ⬅️ ajoute cette ligne
import api from "../services/api";
import "./TeamDetails.css";

const TeamDetails = () => {
const [showAddForm, setShowAddForm] = useState(false);
const [selectedChampionship, setSelectedChampionship] = useState("");
const [availableChampionships, setAvailableChampionships] = useState([]);
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchLoading, setMatchLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn: isAuthenticated } = useAuth(); // ⬅️ récupère le status de connexion ici
const [teamChampionships, setTeamChampionships] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [filterSections, setFilterSections] = useState({
    type: true,
    result: true,
    championships: true,
  });

  const [filters, setFilters] = useState({
    home: false,
    away: false,
    won: false,
    lost: false,
    draw: false,
    championships: {},
  });

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get(`/teams/${id}`);
        setTeam(res.data);
      } catch (err) {
        console.error(err);
        setError("Équipe introuvable.");
      } finally {
        setLoading(false);
      }
    };

    const fetchMatches = async () => {
      try {
        const res = await api.get(`/games/team/${id}`);
        setMatches(res.data || []);
      } catch (err) {
        console.error("❌ Erreur fetch matches:", err);
      } finally {
        setMatchLoading(false);
      }
    };

    fetchTeam();
    fetchMatches();
  }, [id]);


const uniqueChampionships = useMemo(() => {
  return Array.from(
    new Set(matches.map((m) => m.idDay?.idChampionship?.name).filter(Boolean))
  );
}, [matches]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

  const handleChampionshipChange = (championshipName) => {
    setFilters((prev) => ({
      ...prev,
      championships: {
        ...prev.championships,
        [championshipName]: !prev.championships[championshipName],
      },
    }));
  };


useEffect(() => {
  const fetchTeamChampionships = async () => {
    try {
      const res = await api.get(`/teamChampionships/team/${id}/championships`);
      const unique = Array.from(
        new Map(res.data.map(item => [item._id, item])).values()
      );
      setTeamChampionships(unique);
    } catch (err) {
      console.error("Erreur lors du chargement des championnats de l'équipe:", err);
    }
  };

  if (isAuthenticated) {
    fetchTeamChampionships();
  }
}, [id, isAuthenticated]);


useEffect(() => {
  const fetchAvailableChampionships = async () => {
    try {
      const res = await api.get("/championships");
      const all = res.data || [];
      const notAlreadyJoined = all.filter(
        champ => !teamChampionships.some(joined => joined._id === champ._id)
      );
      setAvailableChampionships(notAlreadyJoined);
    } catch (err) {
      console.error("Erreur lors de la récupération des championnats disponibles:", err);
    }
  };

  if (isAuthenticated) {
    fetchAvailableChampionships();
  }
}, [isAuthenticated, teamChampionships]);
const handleAddToChampionship = async (e) => {
  e.preventDefault();

  if (!selectedChampionship) return;

  try {
    await api.post("/teamChampionships/add", {
      teamId: team._id,
      championshipId: selectedChampionship,
    });

    alert("Équipe ajoutée avec succès !");
    setShowAddForm(false);
    setSelectedChampionship("");

    // Recharge les matchs pour voir le changement immédiatement
    const res = await api.get(`/games/team/${id}`);
    setMatches(res.data || []);
    // Recharge les championnats de l'équipe
const champRes = await api.get(`/teamChampionships/team/${id}/championships`);
const unique = Array.from(
  new Map(champRes.data.map(item => [item._id, item])).values()
);
setTeamChampionships(unique);

// Recharge les championnats disponibles (à ne pas proposer à nouveau)
const allRes = await api.get("/championships");
const allChampionships = allRes.data || [];
const notAlreadyJoined = allChampionships.filter(
  (champ) => !unique.some((joined) => joined._id === champ._id)
);
setAvailableChampionships(notAlreadyJoined);
  } catch (err) {
    console.error("Erreur lors de l'ajout :", err);
    alert("Erreur lors de l'ajout de l'équipe au championnat.");
  }
};
  const toggleSection = (section) => {
    setFilterSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const filteredMatches = matches.filter((match) => {
    const isHome = match.idTeam1._id === id;
    const isAway = match.idTeam2._id === id;
    const score1 = match.team1Point;
    const score2 = match.team2Point;
    const championshipName = match.idDay?.idChampionship?.name;

    const matchTypeOK =
      (!filters.home && !filters.away) ||
      (filters.home && isHome) ||
      (filters.away && isAway);

    const resultOK =
      (!filters.won && !filters.lost && !filters.draw) ||
      (filters.won && ((isHome && score1 > score2) || (isAway && score2 > score1))) ||
      (filters.lost && ((isHome && score1 < score2) || (isAway && score2 < score1))) ||
      (filters.draw && score1 === score2);

    const selectedChampionships = Object.keys(filters.championships).filter(
      (key) => filters.championships[key]
    );
    const championshipOK =
      selectedChampionships.length === 0 ||
      (championshipName && selectedChampionships.includes(championshipName));

    return matchTypeOK && resultOK && championshipOK;
  });

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!team) return null;

  return (
    <div className="team-page-wrapper">
      <div className="team-details">
        <div className="team-info-centered">
          <h1>{team.name}</h1>
          <img src={team.logo} alt={`Logo de ${team.name}`} className="team-logo-large" />
          <p><strong>Date de création :</strong> {new Date(team.creationDate).toLocaleDateString()}</p>
          <p><strong>Stade :</strong> {team.stade}</p>
          <p><strong>Pays :</strong> {team.countryId?.name || "Pays inconnu"}</p>
        </div>

        {isAuthenticated ? (
  <div className="team-championships">
    <h2>Championnat(s) joué(s)</h2>
    <ul>
  {teamChampionships.map((champ) => (
    <li key={champ._id}>{champ.name}</li>
  ))}
</ul>

    <button
      onClick={() => setShowAddForm((prev) => !prev)}
      className="add-button"
    >
      {showAddForm ? "Annuler" : "Ajouter cette équipe à un championnat"}
    </button>

{showAddForm && (
  <form onSubmit={handleAddToChampionship} className="add-championship-form">
    <select
      value={selectedChampionship}
      onChange={(e) => setSelectedChampionship(e.target.value)}
      required
    >
      <option value="">-- Sélectionner un championnat --</option>
      {availableChampionships.map((champ) => (
        <option key={champ._id} value={champ._id}>
          {champ.name}
        </option>
      ))}
    </select>
    <button type="submit">Valider</button>
  </form>
)}
  </div>
) : (
          <>
            <hr />
            <div className="team-page">
              <aside className="team-sidebar">
                <button onClick={() => setShowFilters((prev) => !prev)} className="toggle-filters">
                  {showFilters ? "CACHER LES FILTRES" : "AFFICHER LES FILTRES"}
                </button>

                {showFilters && (
                   <div className="match-filters">

              {/* TYPE */}
              <div className="filter-category">
                <div className="filter-header" onClick={() => toggleSection('type')}>
                  <p className="filter-title">TYPE DE MATCH</p>
                  <span>{filterSections.type ? '−' : '+'}</span>
                </div>
                {filterSections.type && (
                  <>
                    <label className="checkbox-label">
                      <input type="checkbox" name="home" checked={filters.home} onChange={handleCheckboxChange} />
                      <span>À domicile</span>
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" name="away" checked={filters.away} onChange={handleCheckboxChange} />
                      <span>À l'extérieur</span>
                    </label>
                  </>
                )}
              </div>

              {/* RÉSULTATS */}
              <div className="filter-category">
                <div className="filter-header" onClick={() => toggleSection('result')}>
                  <p className="filter-title">RÉSULTAT</p>
                  <span>{filterSections.result ? '−' : '+'}</span>
                </div>
                {filterSections.result && (
                  <>
                    <label className="checkbox-label">
                      <input type="checkbox" name="won" checked={filters.won} onChange={handleCheckboxChange} />
                      <span>Gagnés</span>
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" name="lost" checked={filters.lost} onChange={handleCheckboxChange} />
                      <span>Perdus</span>
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" name="draw" checked={filters.draw} onChange={handleCheckboxChange} />
                      <span>Nuls</span>
                    </label>
                  </>
                )}
              </div>

              {/* CHAMPIONNATS */}
              <div className="filter-category">
                <div className="filter-header" onClick={() => toggleSection('championships')}>
                  <p className="filter-title">CHAMPIONNATS</p>
                  <span>{filterSections.championships ? '−' : '+'}</span>
                </div>
                {filterSections.championships && uniqueChampionships.length > 0 && (
                  <div className="championships-filter">
                    {uniqueChampionships.map((champ) => (
                      <label className="checkbox-label" key={champ}>
                        <input
                          type="checkbox"
                          checked={filters.championships[champ] || false}
                          onChange={() => handleChampionshipChange(champ)}
                        />
                        <span>{champ}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
                )}
              </aside>

              <section className="team-main">
                <h2>Matchs de l'équipe</h2>
                {matchLoading ? (
                  <p>Chargement des matchs...</p>
                ) : filteredMatches.length > 0 ? (
                  <div className="match-list">
                    {filteredMatches.map((match) => (
                      <Match
                        key={match._id}
                        result={{
                          ...match,
                          championshipName: match.idDay?.idChampionship?.name || "Championnat inconnu",
                          dayNumber: match.idDay?.number || "?"
                        }}
                        getTeamName={(team) => team?.name || "Équipe inconnue"}
                        isAuthenticated={false}
                        onDelete={() => {}}
                        onUpdate={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <p>Aucun match trouvé avec ces filtres.</p>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeamDetails;




