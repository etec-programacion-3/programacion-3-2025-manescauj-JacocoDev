import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExercisesPage from "./pages/ExercisesPage";
import MuscleGroupsPage from "./pages/MuscleGroupsPage";
import SessionPage from "./pages/SessionPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/grupos-musculares" element={<MuscleGroupsPage />} />
        <Route path="/session/:id" element={<SessionPage />} />
      </Routes>
    </Router>
  );
}

export default App;