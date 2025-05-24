import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Match from "../components/Match";
import api from "../services/api";
import "./ChampionshipDetails.css";

const ChampionshipDetails = () => {
    const navigate = useNavigate();
  const { id } = useParams();
  const [championship, setChampionship] = useState(null);
  const [results, setResults] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMatches, setHasMatches] = useState(false);

  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;
const handleUpdateMatch = async (updatedMatch) => {
  try {
    const response = await api.put(`/games/${updatedMatch._id}`, updatedMatch);
    // Met à jour la liste locale
    setResults(prev =>
      prev.map(m => (m._id === updatedMatch._id ? response.data : m))
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour du match", error);
    alert("Erreur lors de la mise à jour du match");
    throw error; // pour que le catch dans Match sache que ça a échoué
  }
};
  // Fonction simple pour récupérer le nom de l'équipe
  const getTeamName = (team) => {
    return team?.name || "Équipe inconnue";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setHasMatches(false);
        setChampionship(null);
        setResults([]);
        setRanking([]);

        const [championshipRes, resultsRes] = await Promise.all([
          api.get(`/championships/${id}`),
          api.get(`/games/championship/${id}`).catch((err) => {
            if (err.response?.status === 404) {
              return { data: [] };
            }
            throw err;
          }),
        ]);

        if (!championshipRes.data) {
          throw new Error("Championnat non trouvé");
        }

        setChampionship(championshipRes.data);

        if (Array.isArray(resultsRes.data)) {
          if (resultsRes.data.length === 0) {
            setHasMatches(false);
          } else {
            const validMatches = resultsRes.data.filter(
              (match) =>
                match?.idTeam1?._id &&
                match?.idTeam2?._id &&
                typeof match.team1Point === "number" &&
                typeof match.team2Point === "number"
            );

            if (validMatches.length > 0) {
              setResults(validMatches);

              if (!isAuthenticated) {
                setRanking(computeRanking(validMatches, championshipRes.data));
              }
              setHasMatches(true);
            } else {
              setHasMatches(false);
            }
          }
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response?.status === 404
            ? "Aucun match trouvé pour ce championnat"
            : "Erreur lors du chargement des données"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAuthenticated]);
const handleEditMatch = (match) => {
  // Par exemple, rediriger vers une page d'édition
  navigate(`/matches/edit/${match._id}`);
};

const handleDeleteMatch = async (match) => {
  if (window.confirm("Voulez-vous vraiment supprimer ce match ?")) {
    try {
      await api.delete(`/games/${match._id}`);
      // Actualiser la liste des matchs après suppression
      setResults((prev) => prev.filter((m) => m._id !== match._id));
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
      alert("Erreur lors de la suppression du match");
    }
  }
};
  const computeRanking = (matches, championship) => {
    const teams = {};

    matches.forEach((match) => {
      const { idTeam1, idTeam2, team1Point, team2Point } = match;

      if (!teams[idTeam1._id]) {
        teams[idTeam1._id] = {
          name: idTeam1.name,
          points: 0,
          played: 0,
          won: 0,
          draw: 0,
          lost: 0,
        };
      }

      if (!teams[idTeam2._id]) {
        teams[idTeam2._id] = {
          name: idTeam2.name,
          points: 0,
          played: 0,
          won: 0,
          draw: 0,
          lost: 0,
        };
      }

      teams[idTeam1._id].played++;
      teams[idTeam2._id].played++;

      if (team1Point > team2Point) {
        teams[idTeam1._id].won++;
        teams[idTeam1._id].points += championship.wonPoint;
        teams[idTeam2._id].lost++;
        teams[idTeam2._id].points += championship.lostPoint;
      } else if (team1Point < team2Point) {
        teams[idTeam2._id].won++;
        teams[idTeam2._id].points += championship.wonPoint;
        teams[idTeam1._id].lost++;
        teams[idTeam1._id].points += championship.lostPoint;
      } else {
        teams[idTeam1._id].draw++;
        teams[idTeam1._id].points += championship.drawPoint;
        teams[idTeam2._id].draw++;
        teams[idTeam2._id].points += championship.drawPoint;
      }
    });

    return Object.entries(teams)
      .map(([teamId, stats]) => ({ teamId, ...stats }))
      .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  };

  if (loading) return <div className="loading">Chargement en cours...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!championship) return <div className="not-found">Championnat introuvable</div>;

  return (
    <div className="container">
      <header>
        <h1>{championship.name}</h1>
        <div className="championship-meta">
          <span className="date">
            Début : {championship.startDate ? new Date(championship.startDate).toLocaleDateString() : "Date non spécifiée"}
          </span>
          <span className="date">
            Fin : {championship.endDate ? new Date(championship.endDate).toLocaleDateString() : "Date non spécifiée"}
          </span>
          <span className="points">Victoire : {championship.wonPoint}</span>
          <span className="points">Nul : {championship.drawPoint}</span>
          <span className="points">Défaite : {championship.lostPoint}</span>
        </div>
      </header>

      <div className="wrapper">
        {hasMatches ? (
          isAuthenticated ? (
            <>
              <h2>Liste des Matchs</h2>
             {results.map((result) => (
  <Match
    key={result._id}
    result={{ ...result, championshipName: championship.name }}
    getTeamName={getTeamName}
    isAuthenticated={isAuthenticated}
    onDelete={handleDeleteMatch}
    onUpdate={handleUpdateMatch}  // <-- ici
  />
))}
          
            </>
          ) : (
            <>
              <h2>Classement</h2>
              <div className="ranking-container">
                <table className="ranking-table">
                  <thead>
                    <tr>
                      <th>Pos</th>
                      <th>Équipe</th>
                      <th>Pts</th>
                      <th>J</th>
                      <th>V</th>
                      <th>N</th>
                      <th>D</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranking.map((team, index) => (
                      <tr key={team.teamId}>
                        <td className="rank">{index + 1}</td>
                        <td className="team">{team.name}</td>
                        <td className="points">{team.points}</td>
                        <td className="played">{team.played}</td>
                        <td className="won">{team.won}</td>
                        <td className="draw">{team.draw}</td>
                        <td className="lost">{team.lost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )
        ) : (
          <div className="no-matches">
            <p>Ce championnat ne contient aucun match enregistré.</p>
            <p>Aucune donnée de classement disponible.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChampionshipDetails;