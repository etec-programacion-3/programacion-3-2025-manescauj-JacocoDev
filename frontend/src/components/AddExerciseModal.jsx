import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getEjerciciosBySession } from "../services/api";

const AddExerciseModal = ({ open, onClose, onSelect, sessionId }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      try {
        setLoading(true);
        const data = await getEjerciciosBySession(sessionId);
        setOptions(data);
      } catch (err) {
        console.error("Error cargando ejercicios:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, sessionId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-4 w-full max-w-xl z-10">
        <h3 className="text-lg font-semibold mb-3">Agregar ejercicio</h3>

        <Select
          isClearable
          isDisabled={loading}
          value={selected}
          onChange={setSelected}
          getOptionLabel={(opt) => `${opt.nombre} (${opt.grupo_muscular?.nombre || ""})`}
          getOptionValue={(opt) => String(opt.id)}
          options={options}
          placeholder={loading ? "Cargando ejercicios..." : "Seleccionar ejercicio..."}
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => {
              setSelected(null);
              onClose();
            }}
            className="px-3 py-1 rounded bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (!selected) {
                alert("Seleccioná un ejercicio.");
                return;
              }
              onSelect(selected);
              setSelected(null);
              onClose();
            }}
            className="px-3 py-1 rounded bg-blue-600 text-white"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExerciseModal;