
import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
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
const [modalType, setModalType] = useState(null); // "championships" | "countries" | "teams" | "matchdays"
const [modalAction, setModalAction] = useState(null); // "create" | "delete"
  const [data, setData] = useState({
    countries: [],
    championships: [],
    teams: [],
    matchdays: [],
    teamCounts: {}
  });
const [showCreateModal, setShowCreateModal] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [newChampionship, setNewChampionship] = useState({
  name: "",
  countryId: ""
});
;const [entryToDelete, setEntryToDelete] = useState("");

const [newEntry, setNewEntry] = useState({});
const [selectedEntryId, setSelectedEntryId] = useState(null);
const [selectedChampionshipForDay, setSelectedChampionshipForDay] = useState("");
const [filteredDays, setFilteredDays] = useState([]);

const openModal = (type, action) => {
  setModalType(type);
  setModalAction(action);
};
const closeModal = () => {
  setModalType(null);
  setModalAction(null);
  setSelectedChampionship(null);
};

// Gestion dynamique des créations
// 🔄 GESTION DYNAMIQUE DE LA CRÉATION
const handleCreateGeneric = async () => {
  try {
    let endpoint = "";
    let payload = {};

    switch (modalType) {
      case "countries":
        endpoint = "/countries";
        payload = { name: newEntry.name };
        break;
      case "teams":
        endpoint = "/teams";
        payload = {
          name: newEntry.name,
          creationDate: newEntry.creationDate,
          stade: newEntry.stade,
          logo: newEntry.logo,
          countryId: newEntry.countryId,
        };
        break;
      case "days":
      case "matchdays":
        endpoint = "/days";
        payload = {
          number: parseInt(newEntry.number),
          championshipId: newEntry.championshipId,
        };
        break;
      case "championships":
        endpoint = "/championships";
        payload = newChampionship;
        break;
      default:
        return;
    }

    await api.post(endpoint, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Recharge les données pour mise à jour immédiate de l’interface
    const res = await api.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setData(prev => ({
      ...prev,
      [modalType]: res.data,
    }));

    // Réinitialisation des champs
    setNewEntry({});
    setNewChampionship({ name: "", countryId: "" });
    closeModal();
    setShowCreateModal(false);
  } catch (err) {
    console.error("Erreur lors de la création:", err);
    alert(`Erreur lors de la création : ${err.response?.data?.message || err.message}`);
  }
};

// 🔄 GESTION DYNAMIQUE DE LA SUPPRESSION
const handleDeleteGeneric = async () => {
  if (!selectedEntryId) {
    alert("Veuillez sélectionner un élément à supprimer.");
    return;
  }

  const endpointMap = {
    countries: "countries",
    teams: "teams",
    championships: "championships",
    days: "days",
  };

  const endpoint = endpointMap[modalType];
  if (!endpoint) {
    alert("Type non pris en charge.");
    return;
  }

  try {
    await api.delete(`/${endpoint}/${selectedEntryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert(`${modalType.slice(0, -1)} supprimé(e) avec succès`);

    // Vérifie que l'entrée est bien supprimée du tableau
    const updatedList = data[modalType].filter((item) => item._id !== selectedEntryId);

    setData((prev) => ({
      ...prev,
      [modalType]: updatedList,
    }));

    // Si c'était un championnat et que la vue détail était affichée, on la ferme
    if (modalType === "championships" && selectedChampionship?._id === selectedEntryId) {
      setActiveView("championships");
      setSelectedChampionship(null);
    }

    // Réinitialise les états
    setSelectedEntryId(null);
    setSelectedChampionship(null);
    closeModal();

    // Recharge complète en arrière-plan pour les dépendances croisées (ex: teamCounts)
    setTimeout(() => fetchData(), 300);
  } catch (err) {
    console.error("Erreur lors de la suppression:", err);
    alert("Échec de la suppression.");
  }
};
// Ajout dynamique du modal selon le type et l'action


// [...] Le reste du composant

const getChampionshipName = (game) => {
  return game.idDay?.idChampionship?.name || "Championnat inconnu";
};



useEffect(() => {
  if (modalType === "days" && modalAction === "delete" && selectedChampionshipForDay) {
    const daysForChamp = data.matchdays.filter(
      (day) =>
        String(day.idChampionship) === String(selectedChampionshipForDay)
    );
    setFilteredDays(daysForChamp);
  } else {
    setFilteredDays([]);
  }
}, [selectedChampionshipForDay, modalType, modalAction, data.matchdays]);


  const fetchData = async () => {
    try {
      setLoading(true);
      const [countriesRes, championshipsRes, teamsRes, matchdaysRes, resultsRes] = await Promise.all([
        api.get("/countries", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/championships", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/teams", { headers: { Authorization: `Bearer ${token}` } }),
api.get("/days", { headers: { Authorization: `Bearer ${token}` } }).catch((err) => {
        if (err.response?.status === 404) {
          console.warn("Aucune journée trouvée, tableau vide retourné");
          return { data: [] }; // Considérer comme vide
        } else {
          throw err;
        }
      }),        api.get("/games")
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
      setError(null);
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
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

  {/* CHAMPIONNATS */}
  <div className="stat-card">
    <div className="card-btn-group">
      <button className="card-btn card-btn-add" onClick={() => openModal("championships", "create")} title="Ajouter un championnat">
        <FaPlus />
      </button>
      <button className="card-btn card-btn-delete" onClick={() => openModal("championships", "delete")} title="Supprimer un championnat">
        <FaTrash />
      </button>
    </div>
    <div className="stat-header">
      <h3>Championnats</h3>
    </div>
    <p>{data.championships.length}</p>
  </div>

  {/* PAYS */}
  <div className="stat-card">
    <div className="card-btn-group">
      <button className="card-btn card-btn-add"   onClick={() => openModal("countries", "create")}
title="Ajouter un pays">
        <FaPlus />
      </button>
      <button className="card-btn card-btn-delete"  onClick={() => openModal("countries", "delete")}
 title="Supprimer un pays">
        <FaTrash />
      </button>
    </div>
    <div className="stat-header">
      <h3>Pays</h3>
    </div>
    <p>{data.countries.length}</p>
  </div>

  {/* ÉQUIPES */}
  <div className="stat-card">
    <div className="card-btn-group">
      <button className="card-btn card-btn-add"   onClick={() => openModal("teams", "create")}
title="Ajouter une équipe">
        <FaPlus />
      </button>
      <button className="card-btn card-btn-delete"   onClick={() => openModal("teams", "delete")}
title="Supprimer une équipe">
        <FaTrash />
      </button>
    </div>
    <div className="stat-header">
      <h3>Équipes</h3>
    </div>
    <p>{data.teams.length}</p>
  </div>

  {/* JOURNÉES */}
  <div className="stat-card">
    <div className="card-btn-group">
      <button className="card-btn card-btn-add"   onClick={() => openModal("days", "create")}
 title="Ajouter une journée">
        <FaPlus />
      </button>
      <button className="card-btn card-btn-delete"   onClick={() => openModal("days", "delete")}
 title="Supprimer une journée">
        <FaTrash />
      </button>
    </div>
    <div className="stat-header">
      <h3>Journées</h3>
    </div>
    <p>{data.matchdays.length}</p>
  </div>
</div>

<div className="results-section">
  <h3>Tous les matchs</h3>
<div className="match-list">
  {results.length > 0 ? (
    results
      .sort((a, b) => new Date(b.dateMatch) - new Date(a.dateMatch)) // Tri du plus récent au plus ancien
      .map(result => {
        return (
          <Match
            key={result._id}
            result={{
              ...result,
              championshipName: result.idDay?.idChampionship?.name || "Championnat inconnu",
            }}
            getTeamName={getTeamName}
            getMatchDay={getMatchDay}
            getChampionshipName={getChampionshipName}
          />
        );
      })
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


        {/* Modal de création */}




{/* Modal dynamique générique */}
{modalType && modalAction && (
  <div className="modal-overlay">
    <div className="modal">
      {modalAction === "create" ? (
        <>
          <h3>Ajouter un(e) {modalType.slice(0, -1)}</h3>

          {/* === Formulaire CHAMPIONSHIP === */}
          {modalType === "championships" && (
            <>
              <div className="form-group">
                <label>Nom du championnat *</label>
                <input
                  type="text"
                  placeholder="Nom"
                  value={newChampionship.name || ""}
                  onChange={(e) =>
                    setNewChampionship((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Date de début</label>
                <input
                  type="date"
                  value={newChampionship.startDate || ""}
                  onChange={(e) =>
                    setNewChampionship((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                />
              </div>

              <div className="form-group">
                <label>Date de fin</label>
                <input
                  type="date"
                  value={newChampionship.endDate || ""}
                  onChange={(e) =>
                    setNewChampionship((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                />
              </div>

              <div className="form-group">
                <label>Points victoire</label>
                <input
                  type="number"
                  value={newChampionship.wonPoint || ""}
                  onChange={(e) =>
                    setNewChampionship((prev) => ({ ...prev, wonPoint: parseInt(e.target.value) }))
                  }
                />
              </div>

              <div className="form-group">
                <label>Points match nul</label>
                <input
                  type="number"
                  value={newChampionship.drawPoint || ""}
                  onChange={(e) =>
                    setNewChampionship((prev) => ({ ...prev, drawPoint: parseInt(e.target.value) }))
                  }
                />
              </div>

              <div className="form-group">
                <label>Points défaite</label>
                <input
                  type="number"
                  value={newChampionship.lostPoint || ""}
                  onChange={(e) =>
                    setNewChampionship((prev) => ({ ...prev, lostPoint: parseInt(e.target.value) }))
                  }
                />
              </div>

              <div className="form-group">
                <label>Type de classement</label>
                <select
                  value={newChampionship.typeRanking || ""}
                  onChange={(e) =>
                    setNewChampionship((prev) => ({ ...prev, typeRanking: e.target.value }))
                  }
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="points">Par points</option>
                  <option value="victoires">Par victoires</option>
                  <option value="goal-average">Par goal average</option>
                </select>
              </div>
            </>
          )}

          {/* === Formulaire générique (teams, countries) === */}
          {modalType !== "championships" && modalType !== "days" && modalType !== "teams" && (
  <input
    type="text"
    placeholder={`Nom du ${modalType.slice(0, -1)}`}
    value={newEntry.name || ""}
    onChange={(e) =>
      setNewEntry((prev) => ({ ...prev, name: e.target.value }))
    }
    required
  />
)}

          {/* === Formulaire spécifique days === */}
          {modalType === "days" && (
            <>
              <input
                type="number"
                placeholder="Numéro de journée"
                value={newEntry.number || ""}
                onChange={(e) =>
                  setNewEntry((prev) => ({
                    ...prev,
                    number: Number(e.target.value),
                  }))
                }
                required
                min="1"
              />
              <select
                value={newEntry.championshipId || ""}
                onChange={(e) =>
                  setNewEntry((prev) => ({
                    ...prev,
                    championshipId: e.target.value,
                  }))
                }
                required
              >
                <option value="" disabled>
                  -- Sélectionner un championnat --
                </option>
                {data.championships.map((champ) => (
                  <option key={champ._id} value={champ._id}>
                    {champ.name}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* === Sélection pays pour team === */}
       {modalType === "teams" && (
  <>
    {/* Nom de l'équipe */}
    <input
      type="text"
      placeholder="Nom de l'équipe"
      value={newEntry.name || ""}
      onChange={(e) =>
        setNewEntry((prev) => ({ ...prev, name: e.target.value }))
      }
      required
    />

    {/* Date de création */}
    <input
      type="date"
      placeholder="Date de création"
      value={newEntry.creationDate || ""}
      onChange={(e) =>
        setNewEntry((prev) => ({ ...prev, creationDate: e.target.value }))
      }
    />

    {/* Stade */}
    <input
      type="text"
      placeholder="Stade"
      value={newEntry.stade || ""}
      onChange={(e) =>
        setNewEntry((prev) => ({ ...prev, stade: e.target.value }))
      }
    />

    {/* Logo */}
    <input
      type="text"
      placeholder="URL du logo"
      value={newEntry.logo || ""}
      onChange={(e) =>
        setNewEntry((prev) => ({ ...prev, logo: e.target.value }))
      }
    />

    {/* Pays */}
    <select
      value={newEntry.countryId || ""}
      onChange={(e) =>
        setNewEntry((prev) => ({ ...prev, countryId: e.target.value }))
      }
      required
    >
      <option value="" disabled>
        -- Sélectionner un pays --
      </option>
      {data.countries.map((country) => (
        <option key={country._id} value={country._id}>
          {country.name}
        </option>
      ))}
    </select>
  </>
)}

          <div className="modal-actions">
            <button onClick={closeModal}>Annuler</button>
            <button onClick={handleCreateGeneric}>Créer</button>
          </div>
        </>
      ) : (
        // === SUPPRESSION ===
        <>
          <h3>Supprimer un(e) {modalType.slice(0, -1)}</h3>

          {/* === Suppression days avec filtre par championnat === */}
          {modalType === "days" ? (
            <>
              <label>Choisir un championnat</label>
              <select
                value={selectedChampionshipForDay || ""}
                onChange={(e) => {
                  setSelectedChampionshipForDay(e.target.value);
                  setSelectedEntryId("");
                }}
              >
                <option value="">-- Sélectionner un championnat --</option>
                {data.championships.map((champ) => (
                  <option key={champ._id} value={champ._id}>
                    {champ.name}
                  </option>
                ))}
              </select>

              {filteredDays.length > 0 && (
                <>
                  <label>Choisir la journée à supprimer</label>
                  <select
                    value={selectedEntryId || ""}
                    onChange={(e) => setSelectedEntryId(e.target.value)}
                  >
                    <option value="">-- Sélectionner une journée --</option>
                    {filteredDays.map((day) => (
                      <option key={day._id} value={day._id}>
                        Journée {day.number}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {selectedChampionshipForDay && filteredDays.length === 0 && (
                <p style={{ fontStyle: "italic", color: "#888" }}>
                  Aucune journée trouvée pour ce championnat.
                </p>
              )}
            </>
          ) : (
            // === Suppression générique
            <select
              value={selectedEntryId || ""}
              onChange={(e) => setSelectedEntryId(e.target.value)}
            >
              <option value="">Sélectionnez un(e) {modalType.slice(0, -1)}</option>
              {(data[modalType] || []).map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name || item._id}
                </option>
              ))}
            </select>
          )}

          <div className="modal-actions">
            <button onClick={closeModal}>Annuler</button>
            <button onClick={handleDeleteGeneric} disabled={!selectedEntryId}>
              Supprimer
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}
      </main>
    </div>
  );
}