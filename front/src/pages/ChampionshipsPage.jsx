import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// Assure-toi que api est bien configuré avec token
import api from "../services/api";
import "./ChampionshipsPage.css";

const ChampionshipsPage = () => {
  const [championships, setChampionships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChampionships = async () => {
      try {
        const res = await api.get("/championships");
        setChampionships(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des championnats :", err);
        setError("Impossible de charger les championnats. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchChampionships();
  }, []);

  const getRandomColor = () => {
    const colors = [
      "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
      "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
      "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
      "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des championnats...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!championships.length) {
    return <p>Aucun championnat trouvé.</p>;
  }

  return (
    <main className="page-content">
      {championships.map((champ) => {
        const startDateFormatted = champ.startDate
          ? new Date(champ.startDate).toLocaleDateString("fr-FR")
          : "Date non spécifiée";

        return (
          <article 
            key={champ._id || Math.random()} 
            className="card"
            style={{
              backgroundImage: champ.imageUrl 
                ? `url(${champ.imageUrl})` 
                : getRandomColor()
            }}
          >
            <div className="content">
              <h2 className="title">{champ.name}</h2>
              <div className="card-meta">
                <span className="meta-item">
                  <i className="fas fa-calendar-alt" aria-hidden="true"></i>{" "}
                  {startDateFormatted}
                </span>
                {champ.location && (
                  <span className="meta-item">
                    <i className="fas fa-map-marker-alt" aria-hidden="true"></i> {champ.location}
                  </span>
                )}
              </div>
              <p className="copy">
                {champ.description || "Un championnat passionnant à ne pas manquer !"}
              </p>
              <Link to={`/championship/${champ._id}`} className="btn">
                Voir le championnat
              </Link>
            </div>
          </article>
        );
      })}
    </main>
  );
};

export default ChampionshipsPage;