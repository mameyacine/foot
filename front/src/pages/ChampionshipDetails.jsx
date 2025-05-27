import { useCallback, useEffect, useState } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Match from "../components/Match";
import api from "../services/api";
import "./ChampionshipDetails.css";

const ChampionshipDetails = () => {
  const [teams, setTeams] = useState([]); // Ajoutez cette ligne avec les autres états
  const navigate = useNavigate();
  const { id } = useParams();
  const [days, setDays] = useState([]);
  const [championship, setChampionship] = useState(null);
  const [results, setResults] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMatches, setHasMatches] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    wonPoint: 0,
    drawPoint: 0,
    lostPoint: 0
  });
  const [showAddMatchModal, setShowAddMatchModal] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [newMatchData, setNewMatchData] = useState({
  team1: "",
  team2: "",
  team1Point: 0,
  team2Point: 0,
  // autres champs nécessaires
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showAddDayForm, setShowAddDayForm] = useState(false);
  const [dayNumber, setDayNumber] = useState(1);
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;




  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setChampionship(null);
      setResults([]);
      setRanking([]);
      setTeams([]);

      const [championshipRes, resultsRes, daysRes, teamsRes] = await Promise.all([
        api.get(`/championships/${id}`),
        api.get(`/games/championship/${id}`).catch(() => ({ data: [] })),
        api.get(`/days/championship/${id}`).catch(() => ({ data: [] })),
        api.get(`/teamChampionships/championship/${id}/teams`).catch(() => ({ data: [] }))
      ]);

      if (!championshipRes.data) throw new Error("Championnat non trouvé");

      setDays(daysRes.data || []);
setResults(
  (resultsRes.data || []).filter(match => match && match.idDay && match.idDay._id)
);      setTeams(teamsRes.data || []);

      const champData = championshipRes.data;
      setChampionship(champData);
      setFormData({
        name: champData.name,
        startDate: champData.startDate ? champData.startDate.split('T')[0] : "",
        endDate: champData.endDate ? champData.endDate.split('T')[0] : "",
        wonPoint: champData.wonPoint,
        drawPoint: champData.drawPoint,
        lostPoint: champData.lostPoint
      });

      if (resultsRes.data?.length > 0 && !isAuthenticated) {
        setRanking(computeRanking(resultsRes.data, champData));
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.status === 404
          ? "Championnat non trouvé"
          : "Erreur lors du chargement des données"
      );
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated]);

const handleAddMatch = (idDay) => {
    setShowAddMatchModal(true);


  setSelectedDayId(idDay);
  setNewMatchData({
    team1: "",
    team2: "",
    team1Point: 0,
    team2Point: 0,
  });
};


const handleAddMatchSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      idDay: selectedDayId,
      idTeam1: newMatchData.team1,
      idTeam2: newMatchData.team2,
      team1Point: newMatchData.team1Point,
      team2Point: newMatchData.team2Point,
      championshipId: id
    };

    await api.post("/games", payload);

    // Recharge les données après l'ajout
    await fetchData();

    setShowAddMatchModal(false);
  } catch (error) {
    console.error("Erreur lors de l'ajout du match :", error);
    alert("Erreur lors de l'ajout du match");
  }
};

  const handleDeleteDay = async (idDay) => {
  if (window.confirm(`Voulez-vous vraiment supprimer cette journée ?`)) {
    try {
      // Utilisez le service api configuré au lieu de fetch
      await api.delete(`/days/${idDay}`);

      // Mise à jour du state (notez qu'on utilise _id et non id)
      setDays(prevDays => prevDays.filter(day => day._id !== idDay));
      
      // Supprimez aussi les matchs associés si nécessaire
      setResults(prevResults => prevResults.filter(match => match.idDay?._id !== idDay));

      alert("Suppression réussie");
    } catch (error) {
      console.error('Erreur détaillée:', {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      alert(`Erreur: ${error.response?.data?.message || "Échec de la suppression"}`);
    }
  }
  };

  const handleUpdateMatch = async (updatedMatch) => {
    try {
      const response = await api.put(`/games/${updatedMatch._id}`, updatedMatch);
      setResults(prev => prev.map(m => (m._id === updatedMatch._id ? response.data : m)));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du match", error);
      alert("Erreur lors de la mise à jour du match");
    }
  };

  const handleAddDaySubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/days`, { number: dayNumber, championshipId: id });
     const [daysRes, resultsRes] = await Promise.all([
  api.get(`/days/championship/${id}`).catch(() => ({ data: [] })),
  api.get(`/games/championship/${id}`).catch(() => ({ data: [] })),
]);

setDays(daysRes.data || []);
setResults(
  (resultsRes.data || []).filter(match => match && match.idDay && match.idDay._id)
);      setShowAddDayForm(false);
      setDayNumber(1);
      alert(`Journée ${dayNumber} ajoutée avec succès au championnat !`);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la journée", error);
      alert(`Erreur lors de l'ajout de la journée: ${error.message}`);
    }
  };

  const handleAddDayClick = () => {
    setShowAddDayForm(true);
  };

  const getTeamName = (team) => {
    return team?.name || "Équipe inconnue";
  };
useEffect(() => {
  fetchData();
}, [fetchData]);

  const handleDeleteMatch = async (match) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce match ?")) {
      try {
        await api.delete(`/games/${match._id}`);
        setResults(prev => prev.filter(m => m._id !== match._id));
      } catch (err) {
        console.error("Erreur lors de la suppression", err);
        alert("Erreur lors de la suppression du match");
      }
    }
  };



  const handleCancel = () => {
    setIsEditing(false);
    if (championship) {
      setFormData({
        name: championship.name,
        startDate: championship.startDate ? championship.startDate.split('T')[0] : "",
        endDate: championship.endDate ? championship.endDate.split('T')[0] : "",
        wonPoint: championship.wonPoint,
        drawPoint: championship.drawPoint,
        lostPoint: championship.lostPoint
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.endsWith('Point') ? Number(value) : value
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Le nom du championnat est obligatoire");
      return;
    }

    try {
      setIsSaving(true);
      const updatedChampionship = {
        ...championship,
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        wonPoint: formData.wonPoint,
        drawPoint: formData.drawPoint,
        lostPoint: formData.lostPoint
      };

      const response = await api.put(`/championships/${championship._id}`, updatedChampionship);
      setChampionship(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du championnat :", err);
      alert("Erreur lors de la mise à jour du championnat");
    } finally {
      setIsSaving(false);
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

const resultsByDay = (Array.isArray(days) ? days : [])
  .filter(day => day && day._id)
  
  .map(day => {
    const matchesForDay = (Array.isArray(results) ? results : [])
      .filter(match => {
        const isValid = match?.idDay?._id === day._id;
        if (!match?.idDay || !match.idDay._id) {
          console.warn("⛔ Match sans idDay ou idDay._id : ", match);
        }
        return isValid;
      });

    return {
      dayNumber: Number(day.number),
      matches: matchesForDay,
      idDay: day._id,
    };
  })
  .sort((a, b) => a.dayNumber - b.dayNumber);
// Et si tu veux filtrer séparément :
  return (
    <div className="container">
      <header className="championship-header">
        {isEditing ? (
          <div className="championship-edit-form">
            <h2>Modifier le championnat</h2>
            <div className="form-group">
              <label>Nom:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date de début:</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Date de fin:</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Points victoire:</label>
                <input
                  type="number"
                  name="wonPoint"
                  value={formData.wonPoint}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Points nul:</label>
                <input
                  type="number"
                  name="drawPoint"
                  value={formData.drawPoint}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Points défaite:</label>
                <input
                  type="number"
                  name="lostPoint"
                  value={formData.lostPoint}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
            <div className="form-actions">
              <button onClick={handleSave} className="btn-save" disabled={isSaving}>
                <FaSave /> {isSaving ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button onClick={handleCancel} className="btn-cancel" disabled={isSaving}>
                <FaTimes /> Annuler
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="championship-header-top">
              <h1>{championship.name}</h1>

            </div>
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
            {isAuthenticated && (
              <div className="add-day-button">
                {showAddDayForm ? (
                  <form onSubmit={handleAddDaySubmit} className="add-day-form">
                    <div className="form-group">
                      <label>Numéro de la journée:</label>
                      <input
                        type="number"
                        min="1"
                        value={dayNumber}
                        onChange={(e) => setDayNumber(parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn-save">
                        <FaSave /> Confirmer
                      </button>
                      <button type="button" onClick={() => setShowAddDayForm(false)} className="btn-cancel">
                        <FaTimes /> Annuler
                      </button>
                    </div>
                  </form>
                ) : (
                  <button onClick={handleAddDayClick} className="btn-add">
                    ➕ Ajouter une journée
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </header>
<div className="wrapper">


{isAuthenticated ? (
  
  days.length > 0 ? (
    resultsByDay.map(({ dayNumber, matches, idDay }) => (
      <div key={idDay} className="day-section">
        <div className="day-header">
          <h3>Journée {dayNumber}</h3>
          <div>
            <button
              onClick={() => handleAddMatch(idDay)}
              className="btn-add-match"
            >
              + Ajouter un match
            </button>
            <button
              onClick={() => handleDeleteDay(idDay)}
              className="btn-delete-day"
              title="Supprimer la journée"
            >
              🗑️ Supprimer journée
            </button>
          </div>
        </div>

        {matches.length > 0 ? (
          matches.map((match) => (
            <Match
              key={match._id}
              result={{ ...match, championshipName: championship.name }}
              getTeamName={getTeamName}
              isAuthenticated={isAuthenticated}
              onDelete={handleDeleteMatch}
              onUpdate={handleUpdateMatch}
            />
          ))
        ) : (
          <p>Aucun match pour cette journée.</p>
        )}
      </div>
    ))
  ) : (
    <p>Aucune journée disponible.</p>
  )
) : null}

  {!isAuthenticated && results.length > 0 && (
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
  )}

  {results.length === 0 && (
    <div className="no-matches">
      <p>Ce championnat ne contient aucun match enregistré.</p>
      <p>Aucune donnée de classement disponible.</p>
    </div>
  )}

</div>
{showAddMatchModal && (
  <div className="modal-overlay">
    <div className="modal">
 <h3>Ajouter un match pour la journée</h3>
      <form onSubmit={handleAddMatchSubmit}>
        <div className="form-group">
          <label>Équipe 1 :</label>
          <select
            value={newMatchData.team1}
            onChange={(e) => setNewMatchData(prev => ({ ...prev, team1: e.target.value }))}
            required
            className="form-select"
          >
            <option value="">Sélectionnez une équipe</option>
           {teams
  .filter(team => team && team._id) // 👈 important pour éviter le crash
  .map(team => (
    <option key={team._id} value={team._id}>
      {team.name}
    </option>
))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Équipe 2 :</label>
          <select
            value={newMatchData.team2}
            onChange={(e) => setNewMatchData(prev => ({ ...prev, team2: e.target.value }))}
            required
            className="form-select"
          >
            <option value="">Sélectionnez une équipe</option>
            {teams
  .filter(team => team && team._id && team._id !== newMatchData.team1)
  .map(team => (
    <option key={team._id} value={team._id}>
      {team.name}
    </option>
))}
          </select>
        </div>
        <div>
          <label>Score Équipe 1 :</label>
          <input
            type="number"
            value={newMatchData.team1Point}
            onChange={(e) => setNewMatchData(prev => ({ ...prev, team1Point: Number(e.target.value) }))}
            min={0}
            required
          />
        </div>
        
        <div>
          <label>Score Équipe 2 :</label>
          <input
            type="number"
            value={newMatchData.team2Point}
            onChange={(e) => setNewMatchData(prev => ({ ...prev, team2Point: Number(e.target.value) }))}
            min={0}
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-save">Enregistrer</button>
          <button type="button" onClick={() => setShowAddMatchModal(false)} className="btn-cancel">Annuler</button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>

    
  );
  
};

export default ChampionshipDetails;