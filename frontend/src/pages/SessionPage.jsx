import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSessionById, updateSession, deleteSession } from "../services/api";
import ExerciseTable from "../components/ExerciseTable";

const SessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ fecha: "", notas: "" });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await getSessionById(id);
        setSession(data);
        setFormData({
          fecha: data.fecha ? data.fecha.split("T")[0] : "",
          notas: data.notas || "",
        });
      } catch (error) {
        console.error("Error al cargar la sesión:", error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        fecha: formData.fecha,
        notas: formData.notas,
        grupo_ids: session.grupos_musculares.map((g) => g.id),
      };
      const updated = await updateSession(id, payload);
      setSession(updated);
      setEditMode(false);
      alert("✅ Sesión actualizada correctamente.");
    } catch (err) {
      console.error(err);
      alert("❌ Error al actualizar la sesión.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Seguro que deseas eliminar esta sesión?");
    if (!confirmDelete) return;

    try {
      await deleteSession(id);
      alert("🗑️ Sesión eliminada correctamente.");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("❌ Error al eliminar la sesión.");
    }
  };

  if (loading) return <p>Cargando sesión...</p>;
  if (!session) return <p>No se encontró la sesión.</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate("/")} className="text-blue-600 hover:underline">
          ← Volver
        </button>
        <h2 className="text-xl font-bold">
          Sesión — {new Date(session.fecha).toLocaleDateString("es-AR")}
        </h2>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          🗑️ Eliminar
        </button>
      </div>

      {/* Datos de sesión */}
      <div className="bg-white p-4 rounded shadow">
        {editMode ? (
          <>
            <label className="block mb-2">
              Fecha:
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </label>

            <label className="block mb-2">
              Notas:
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </label>

            <div className="flex gap-2 mt-3">
              <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
                Guardar
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-2">
              <strong>Notas:</strong> {session.notas || "Sin notas"}
            </p>
            <p className="mb-2">
              <strong>Grupos musculares:</strong>{" "}
              {session.grupos_musculares.map((g) => g.nombre).join(", ")}
            </p>

            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
            >
              ✏️ Editar
            </button>
          </>
        )}
      </div>

      {/* Tabla de ejercicios (nuevo componente) */}
      <ExerciseTable />
    </div>
  );
};

export default SessionPage;