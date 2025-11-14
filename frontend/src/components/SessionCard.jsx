import React from "react";
import { Link } from "react-router-dom";

const SessionCard = ({ sesion }) => {
  const getGroupsList = () => {
    const groups = sesion.grupos_musculares || [];
    if (groups.length === 0) return [];

    const visible = groups.slice(0, 3).map((g) => g.nombre);
    if (groups.length > 3) visible.push("...");

    return visible;
  };

  const getExercisesCount = () => {
    if (typeof sesion.total_ejercicios === "number") return sesion.total_ejercicios;
    if (typeof sesion.exercise_count === "number") return sesion.exercise_count;
    if (Array.isArray(sesion.ejercicios)) return sesion.ejercicios.length;

    if (Array.isArray(sesion.series)) {
      const uniq = new Set();
      sesion.series.forEach((s) => {
        if (s.ejercicio?.id) uniq.add(s.ejercicio.id);
      });
      return uniq.size || sesion.series.length;
    }
    return 0;
  };

  const fechaTexto = sesion.fecha
    ? new Date(sesion.fecha).toLocaleDateString("es-AR")
    : "Sin fecha";

  const groups = getGroupsList();

  return (
    <Link to={`/session/${sesion.id}`} className="block">
      <div className="h-40 md:h-44 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow hover:shadow-xl transition-all p-4 flex flex-col justify-between">

        {/* Fecha */}
        <div className="pb-2 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm font-bold flex items-center gap-1">
            📅 {fechaTexto}
          </p>
        </div>

        {/* Grupos musculares */}
        <div className="mt-2">
          <p className="text-sm font-bold">Grupos musculares:</p>
          <ul className="list-disc ml-5 mt-1 text-sm text-gray-700 dark:text-gray-300">
            {groups.length === 0 ? (
              <li>—</li>
            ) : (
              groups.map((g, i) => <li key={i}>{g}</li>)
            )}
          </ul>
        </div>

        {/* Ejercicios */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-bold">Ejercicios:</span>
          <span className="font-extrabold text-lg">{getExercisesCount()}</span>
        </div>
      </div>
    </Link>
  );
};

export default SessionCard;