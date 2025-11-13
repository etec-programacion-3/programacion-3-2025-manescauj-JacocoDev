import React from "react";

const ExerciseTable = () => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Ejercicios y Series</h3>
        {/* Botón placeholder; por ahora no implementa la lógica de agregar */}
        <button
          disabled
          title="Funcionalidad pendiente: agregar ejercicio"
          className="px-3 py-1 rounded bg-gray-300 text-gray-700 cursor-not-allowed"
        >
          + Agregar ejercicio
        </button>
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
            {/* Tabla vacía por ahora */}
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-600">
                No hay ejercicios todavía. Aquí podrás agregar ejercicios y sus series.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-sm text-gray-500">
        Nota: la funcionalidad para agregar ejercicios y series se implementará en la Issue #9.
      </p>
    </div>
  );
};

export default ExerciseTable;