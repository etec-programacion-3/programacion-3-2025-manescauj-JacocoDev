import React, { useEffect, useState } from "react";
import api from "../services/api";
import MuscleGroupTable from "../components/MuscleGroupTable";
import MuscleGroupForm from "../components/MuscleGroupForm";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

const MuscleGroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editGroup, setEditGroup] = useState(null);

  const navigate = useNavigate();

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await api.get("/grupos-musculares");
      setGroups(res.data);
    } catch (err) {
      console.error(err);
      setError("Error cargando los grupos musculares.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreated = (nuevo) => {
    if (editGroup) {
      setGroups((prev) =>
        prev.map((g) => (g.id === nuevo.id ? nuevo : g))
      );
    } else {
      setGroups((prev) => [nuevo, ...prev]);
    }
    setIsModalOpen(false);
    setEditGroup(null);
  };

  const handleEdit = (group) => {
    setEditGroup(group);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este grupo muscular?")) return;
    try {
      await api.delete(`/grupos-musculares/${id}`);
      setGroups((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      alert("Error eliminando grupo");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen px-6 pt-24">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold mb-4">Grupos musculares</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
      >
        Nuevo Grupo
      </button>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <MuscleGroupTable groups={groups} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <Modal
        title={editGroup ? "Editar Grupo" : "Nuevo Grupo"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditGroup(null);
        }}
      >
        <MuscleGroupForm onCreated={handleCreated} editGroup={editGroup} />
      </Modal>
    </div>
  );
};

export default MuscleGroupsPage;