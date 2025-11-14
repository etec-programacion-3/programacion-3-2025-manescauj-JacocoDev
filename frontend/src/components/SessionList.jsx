import React, { useState } from "react";
import Sidebar from "./Sidebar";
import SessionCard from "./SessionCard";

const SessionList = ({ sesiones = [], onOpenCreate }) => {
  const [collapsed, setCollapsed] = useState(false);
  const handleToggle = () => setCollapsed((c) => !c);

  return (
    <div className="min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={handleToggle} />

      <main
        className={`transition-all ml-16 ${collapsed ? "md:ml-16" : "md:ml-64"} pt-20 px-4`}
      >
        {/* Header fijo */}
        <header
          className={`fixed top-0 left-0 right-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center px-6 transition-all ${
            collapsed ? "ml-16 md:ml-16" : "ml-16 md:ml-64"
          }`}
        >
          <h1 className="text-2xl font-bold">Sesiones</h1>
        </header>


        <div className="max-w-7xl mx-auto mt-6">
          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {/* Tarjeta + */}
            <button
              onClick={onOpenCreate}
              className="h-40 md:h-44 w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-3xl hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow hover:shadow-xl"
            >
              +
            </button>

            {/* Sesiones */}
            {sesiones.map((s) => (
              <SessionCard key={s.id} sesion={s} />
            ))}
          </div>

          {/* Estado vacío */}
          {sesiones.length === 0 && (
            <div className="mt-6 text-center text-gray-600 dark:text-gray-300">
              No hay sesiones registradas. Usa el botón + para agregar la primera.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SessionList;