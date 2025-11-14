import React, { useEffect, useState } from "react";
import api from "../services/api";
import ExerciseTable from "../components/ExerciseTable";
import ExerciseForm from "../components/ExerciseForm";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

const ExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editExercise, setEditExercise] = useState(null);

  const navigate = useNavigate();

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const resExercises = await api.get("/ejercicios");
      setExercises(resExercises.data);
      const resGroups = await api.get("/grupos-musculares");
      setGroups(resGroups.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error cargando ejercicios.");
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleCreated = (nuevo) => {
    if (editExercise) {
      setExercises((prev) =>
        prev.map((e) => (e.id === nuevo.id ? nuevo : e))
      );
    } else {
      setExercises((prev) => [nuevo, ...prev]);
    }
    setIsModalOpen(false);
    setEditExercise(null);
  };

  const handleEdit = (exercise) => {
    setEditExercise(exercise);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este ejercicio?")) return;
    try {
      await api.delete(`/ejercicios/${id}`);
      setExercises((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error eliminando ejercicio");
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

      <h1 className="text-2xl font-bold mb-4">Ejercicios</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
      >
        Nuevo Ejercicio
      </button>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ExerciseTable
          exercises={exercises}
          groups={groups}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Modal
        title={editExercise ? "Editar Ejercicio" : "Nuevo Ejercicio"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditExercise(null);
        }}
      >
        <ExerciseForm
          onCreated={handleCreated}
          editExercise={editExercise}
          groups={groups}
        />
      </Modal>
    </div>
  );
};

export default ExercisesPage;