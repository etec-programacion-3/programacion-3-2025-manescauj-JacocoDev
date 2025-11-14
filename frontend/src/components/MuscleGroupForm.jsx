import React, { useState, useEffect } from "react";
import api from "../services/api";

const MuscleGroupForm = ({ onCreated, editGroup }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editGroup) setName(editGroup.nombre);
  }, [editGroup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = editGroup
        ? await api.put(`/grupos-musculares/${editGroup.id}`, { nombre: name })
        : await api.post("/grupos-musculares", { nombre: name });

      onCreated(res.data);
      setName("");
    } catch (err) {
      alert("Error creando/actualizando grupo");
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

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
        >
          {editGroup ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
};

export default MuscleGroupForm;