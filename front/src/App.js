import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { AuthProvider } from "./context/AuthContext";
import ChampionshipDetails from "./pages/ChampionshipDetails";
import HomePage from "./pages/Dashboard";
import TeamDetails from "./pages/TeamDetails";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/championships/:id" element={<ChampionshipDetails />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/teams/:id" element={<TeamDetails />} />


          <Route path="*" element={<AuthForm />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;