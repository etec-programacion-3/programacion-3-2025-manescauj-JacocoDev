import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api"; // tu axios instance
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
      setSesiones(response.data || []);
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
    // nuevaSesion debería venir del backend tal cual para mantener consistencia
    setSesiones((prev) => [nuevaSesion, ...prev]);
    setIsModalOpen(false);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (loading)
    return <p style={{ textAlign: "center", marginTop: 40 }}>Cargando sesiones...</p>;
  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", marginTop: 40 }}>{error}</p>
    );

  return (
    <div>
      <SessionList sesiones={sesiones} onOpenCreate={handleOpenModal} />

      <Modal title="Crear nueva sesión" isOpen={isModalOpen} onClose={handleCloseModal}>
        <SessionForm onCreated={handleCreated} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default HomePage;