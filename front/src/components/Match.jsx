import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./Match.css";
export default function Match({ result, getTeamName, isAuthenticated, onEdit, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [team1Point, setTeam1Point] = useState(result.team1Point);
  const [team2Point, setTeam2Point] = useState(result.team2Point);

  const team1Logo = result.team1Logo || null;
  const team2Logo = result.team2Logo || null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedMatch = {
      ...result,
      team1Point: Number(team1Point),
      team2Point: Number(team2Point),
    };

    onUpdate(updatedMatch);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTeam1Point(result.team1Point);
    setTeam2Point(result.team2Point);
  };

  if (isEditing) {
    return (
<div className="match-editing">
        <form onSubmit={handleSubmit} style={{ padding: "16px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <div style={{ marginBottom: "10px" }}>
            <label>
              {getTeamName(result.idTeam1)}:
              <input
                type="number"
                min="0"
                value={team1Point}
                onChange={(e) => setTeam1Point(e.target.value)}
                required
                style={{ marginLeft: "10px", width: "60px" }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              {getTeamName(result.idTeam2)}:
              <input
                type="number"
                min="0"
                value={team2Point}
                onChange={(e) => setTeam2Point(e.target.value)}
                required
                style={{ marginLeft: "10px", width: "60px" }}
              />
            </label>
          </div>
          <button type="submit" style={{ marginRight: "10px" }}>
            Sauvegarder
          </button>
          <button type="button" onClick={handleCancel}>
            Annuler
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="match">
      <div className="match-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px" }}>
        <div className="match-tournament" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="https://assets.codepen.io/285131/pl-logo.svg"
            alt="Logo championnat"
            style={{ height: "30px" }}
          />
          <span>{result.championshipName || "Championnat inconnu"}</span>
        </div>

        {isAuthenticated && (
     <div className="match-actions">
  <button className="btn-edit" onClick={() => setIsEditing(true)}>
    <FaEdit />
  </button>
  <button className="btn-delete" onClick={() => onDelete(result)}>
    <FaTrash />
  </button>
</div>
        )}
      </div>

      <div className="match-content">
        <div className="column">
          <div className="team team--home">
            <div className="team-logo">
              {team1Logo ? (
                <img src={team1Logo} alt={getTeamName(result.idTeam1)} />
              ) : (
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    fontSize: "28px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                  }}
                >
                  {getTeamName(result.idTeam1).charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h2 className="team-name">{getTeamName(result.idTeam1)}</h2>
          </div>
        </div>

        <div className="column">
          <div className="match-details">
<div className="match-date">
  {result.idDay ? `Journée ${result.idDay.number}` : "Journée inconnue"}
</div>            <div className="match-score">
              <span
                className={
                  "match-score-number" +
                  (result.team1Point > result.team2Point ? " match-score-number--leading" : "")
                }
              >
                {result.team1Point}
              </span>
              <span className="match-score-divider">:</span>
              <span
                className={
                  "match-score-number" +
                  (result.team2Point > result.team1Point ? " match-score-number--leading" : "")
                }
              >
                {result.team2Point}
              </span>
            </div>
          </div>
        </div>

        <div className="column">
          <div className="team team--away">
            <div className="team-logo">
              {team2Logo ? (
                <img src={team2Logo} alt={getTeamName(result.idTeam2)} />
              ) : (
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    fontSize: "28px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                  }}
                >
                  {getTeamName(result.idTeam2).charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h2 className="team-name">{getTeamName(result.idTeam2)}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}