import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import SessionList from "../components/SessionList";
import Modal from "../components/Modal";
import SessionForm from "../components/SessionForm";

const HomePage = () => {
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSesiones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/sesiones");
      setSesiones(response.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar las sesiones. Verifica el backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSesiones();
  }, [fetchSesiones]);

  const handleCreated = (nuevaSesion) => {
    setSesiones((prev) => [nuevaSesion, ...prev]);
    setIsModalOpen(false);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>Cargando sesiones...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red", marginTop: 40 }}>{error}</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Sesiones Registradas</h2>
        <button
          onClick={handleOpenModal}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "none",
            background: "#10b981",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          + Nueva sesión
        </button>
      </div>

      {sesiones.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555" }}>No hay sesiones registradas.</p>
      ) : (
        <SessionList sesiones={sesiones} />
      )}

      <Modal title="Crear nueva sesión" isOpen={isModalOpen} onClose={handleCloseModal}>
        <SessionForm onCreated={handleCreated} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default HomePage;