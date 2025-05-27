import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Football Championship. Tous droits réservés.</p>
    </footer>
  );
};

export default Footer;