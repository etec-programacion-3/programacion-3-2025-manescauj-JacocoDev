import React from "react";

const MuscleGroupTable = ({ groups, onEdit, onDelete }) => {
  return (
    <table className="w-full table-auto border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-4 py-2 text-left text-black">Nombre</th>
          <th className="border px-4 py-2 text-black">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {groups.map((g) => (
          <tr key={g.id}>
            <td className="border px-4 py-2">{g.nombre}</td>
            <td className="border px-4 py-2 text-center">
              <button
                onClick={() => onEdit(g)}
                className="mr-2 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(g.id)}
                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MuscleGroupTable;