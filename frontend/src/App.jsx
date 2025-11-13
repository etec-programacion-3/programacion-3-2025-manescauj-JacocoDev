import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SessionPage from "./pages/SessionPage";

function App() {
  return (
    <Router>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-8">
          🏋️ Proyecto Integrador — Sessions
        </h1>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/session/:id" element={<SessionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;