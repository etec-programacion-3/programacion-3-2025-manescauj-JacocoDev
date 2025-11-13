import React from "react";
import { Link } from "react-router-dom";

const SessionList = ({ sesiones }) => {
  return (
    <ul className="space-y-4">
      {sesiones.map((sesion) => (
        <li
          key={sesion.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
        >
          {/* ✅ FIX: usamos /session/ (con doble s) */}
          <Link to={`/session/${sesion.id}`}>
            <p className="font-semibold text-gray-800">
              📅 {new Date(sesion.fecha).toLocaleDateString("es-AR")}
            </p>
            <p className="text-gray-700 mt-1">📝 {sesion.notas}</p>
            <p className="text-gray-600 mt-2">
              💪 {sesion.grupos_musculares.map((g) => g.nombre).join(", ")}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SessionList;