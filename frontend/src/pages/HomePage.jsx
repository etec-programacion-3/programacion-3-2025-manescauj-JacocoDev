import React, { useEffect, useState } from "react";
import api from "../services/api";
import SessionList from "../components/SessionList";

const HomePage = () => {
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSesiones = async () => {
      try {
        const response = await api.get("/sesiones");
        setSesiones(response.data);
      } catch (err) {
        setError("Error al cargar las sesiones. Verifica el backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchSesiones();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Cargando sesiones...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 mt-10">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center">Sesiones Registradas</h2>
      {sesiones.length === 0 ? (
        <p className="text-center text-gray-600">No hay sesiones registradas.</p>
      ) : (
        <SessionList sesiones={sesiones} />
      )}
    </div>
  );
};

export default HomePage;