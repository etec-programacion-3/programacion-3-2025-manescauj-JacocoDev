import React, { useState, useEffect } from "react";
import api from "../services/api";

const ExerciseForm = ({ onCreated, editExercise, groups }) => {
  const [name, setName] = useState("");
  const [muscle, setMuscle] = useState("");
  const [groupId, setGroupId] = useState("");

  useEffect(() => {
    if (editExercise) {
      setName(editExercise.nombre);
      setMuscle(editExercise.musculo_enfocado || "");
      setGroupId(editExercise.grupo_muscular?.id || "");
    } else {
      setName("");
      setMuscle("");
      setGroupId("");
    }
  }, [editExercise]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: name,
        musculo_enfocado: muscle,
        grupo_muscular_id: Number(groupId),
      };
      const res = editExercise
        ? await api.put(`/ejercicios/${editExercise.id}`, payload)
        : await api.post("/ejercicios", payload);
      onCreated(res.data);
      setName("");
      setMuscle("");
      setGroupId("");
    } catch (err) {
      alert("Error creando/actualizando ejercicio");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Músculo enfocado</label>
        <input
          type="text"
          value={muscle}
          onChange={(e) => setMuscle(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Grupo muscular</label>
        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded"
          required
        >
          <option value="">Seleccione grupo</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
        >
          {editExercise ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
};

export default ExerciseForm;