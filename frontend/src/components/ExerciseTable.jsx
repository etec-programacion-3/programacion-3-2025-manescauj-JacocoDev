import React, { useEffect, useState } from "react";
import AddExerciseModal from "./AddExerciseModal";
import {
  getSeriesBySession,
  addSerieToSession,
  updateSerie,
  deleteSerie,
} from "../services/api";

const ExerciseTable = ({ sessionId }) => {
  const [rows, setRows] = useState([]); // { ejercicio: {...}, series: [{id,peso,repeticiones,isSaved}] }
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const series = await getSeriesBySession(sessionId);
        // agrupar por ejercicio
        const grouped = {};
        series.forEach((s) => {
          const ej = s.ejercicio;
          if (!grouped[ej.id]) grouped[ej.id] = { ejercicio: ej, series: [] };
          grouped[ej.id].series.push({
            id: s.id,
            peso: s.peso,
            repeticiones: s.repeticiones,
            isSaved: true,
          });
        });
        setRows(Object.values(grouped));
      } catch (err) {
        console.error("Error cargando series:", err);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [sessionId]);

  const handleSelectExercise = (ejercicio) => {
    const exists = rows.find((r) => r.ejercicio.id === ejercicio.id);
    if (exists) {
      alert("El ejercicio ya está agregado.");
      return;
    }
    setRows((prev) => [...prev, { ejercicio, series: [] }]);
  };

  const handleAddSerieLocal = (ejId) => {
    setRows((prev) =>
      prev.map((r) =>
        r.ejercicio.id === ejId
          ? {
              ...r,
              series: [
                ...r.series,
                { id: `new-${Date.now()}`, peso: "", repeticiones: "", isSaved: false },
              ],
            }
          : r
      )
    );
  };

  const handleSerieChange = (ejId, serieId, field, value) => {
    setRows((prev) =>
      prev.map((r) =>
        r.ejercicio.id === ejId
          ? {
              ...r,
              series: r.series.map((s) => (s.id === serieId ? { ...s, [field]: value } : s)),
            }
          : r
      )
    );
  };

  const handleSaveSerie = async (ejId, serie) => {
    try {
      if (serie.isSaved) {
        await updateSerie(serie.id, {
          ejercicio_id: ejId,
          repeticiones: Number(serie.repeticiones),
          peso: Number(serie.peso),
        });
        alert("Serie actualizada.");
      } else {
        const created = await addSerieToSession(sessionId, {
          ejercicio_id: ejId,
          repeticiones: Number(serie.repeticiones),
          peso: Number(serie.peso),
        });
        setRows((prev) =>
          prev.map((r) =>
            r.ejercicio.id === ejId
              ? {
                  ...r,
                  series: r.series.map((s) => (s.id === serie.id ? { ...created, isSaved: true } : s)),
                }
              : r
          )
        );
        alert("Serie guardada.");
      }
    } catch (err) {
      console.error(err);
      alert("Error guardando la serie.");
    }
  };

  const handleDeleteSerie = async (ejId, serie) => {
    const proceed = window.confirm("Eliminar serie?");
    if (!proceed) return;
    try {
      if (serie.isSaved) {
        await deleteSerie(serie.id);
      }
      setRows((prev) =>
        prev
          .map((r) =>
            r.ejercicio.id === ejId ? { ...r, series: r.series.filter((s) => s.id !== serie.id) } : r
          )
          .filter((r) => !(r.ejercicio.id === ejId && r.series.length === 0))
      );
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la serie.");
    }
  };

  const handleRemoveExercise = (ejId) => {
    const proceed = window.confirm("Quitar ejercicio de la vista (las series guardadas no se borran desde aquí).");
    if (!proceed) return;
    setRows((prev) => prev.filter((r) => r.ejercicio.id !== ejId));
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Ejercicios y Series</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setModalOpen(true)}
            className="px-3 py-1 rounded bg-blue-600 text-white"
          >
            + Agregar ejercicio
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">#</th>
              <th className="p-2">Ejercicio</th>
              <th className="p-2">Series</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="p-4 text-center">Cargando...</td>
              </tr>
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-600">
                  No hay ejercicios todavía. Agregá uno desde el botón.
                </td>
              </tr>
            )}

            {!loading && rows.map((row, idx) => (
              <tr key={row.ejercicio.id} className="border-b align-top">
                <td className="p-2 align-top">{idx + 1}</td>
                <td className="p-2 align-top">
                  <div className="font-medium">{row.ejercicio.nombre}</div>
                  <div className="text-sm text-gray-500">{row.ejercicio.musculo_enfocado || row.ejercicio.grupo_muscular?.nombre}</div>
                </td>
                <td className="p-2">
                  {row.series.length === 0 && <div className="text-sm text-gray-500">Sin series</div>}
                  {row.series.map((s) => (
                    <div key={s.id} className="mb-2 p-2 border rounded">
                      <div className="flex flex-wrap gap-2 items-center">
                        <label className="text-sm">Peso:</label>
                        <input
                          type="number"
                          value={s.peso}
                          onChange={(e) => handleSerieChange(row.ejercicio.id, s.id, "peso", e.target.value)}
                          className="border p-1 rounded w-24"
                        />
                        <label className="text-sm">Reps:</label>
                        <input
                          type="number"
                          value={s.repeticiones}
                          onChange={(e) => handleSerieChange(row.ejercicio.id, s.id, "repeticiones", e.target.value)}
                          className="border p-1 rounded w-20"
                        />

                        <button
                          onClick={() => handleSaveSerie(row.ejercicio.id, s)}
                          className="bg-green-600 text-white px-2 py-1 rounded"
                        >
                          {s.isSaved ? "Actualizar" : "Guardar"}
                        </button>

                        <button
                          onClick={() => handleDeleteSerie(row.ejercicio.id, s)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </td>
                <td className="p-2 align-top">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleAddSerieLocal(row.ejercicio.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      + Agregar serie
                    </button>
                    <button
                      onClick={() => handleRemoveExercise(row.ejercicio.id)}
                      className="bg-gray-300 px-3 py-1 rounded"
                    >
                      Quitar ejercicio
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-sm text-gray-500">
        Guardá cada serie con el botón correspondiente; las series nuevas se crearán en el backend.
      </p>

      <AddExerciseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleSelectExercise}
        sessionId={sessionId}
      />
    </div>
  );
};

export default ExerciseTable;