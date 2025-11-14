import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-20 transition-all bg-gray-900 text-white ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="h-full flex flex-col">

        {/* Top */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-gray-700">
          {!collapsed ? <h2 className="text-lg font-semibold">Menú</h2> : <span>≡</span>}
          <button
            onClick={onToggle}
            className="p-1 rounded hover:bg-gray-800"
            aria-label="toggle sidebar"
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-1 py-4">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => navigate("/")}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800"
              >
                <span className="text-xl">📅</span>
                {!collapsed && <span>Sesiones</span>}
              </button>
            </li>

            <li>
              <button
                onClick={() => navigate("/grupos-musculares")}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800"
              >
                <span className="text-xl">💪</span>
                {!collapsed && <span>Grupos musculares</span>}
              </button>
            </li>

            <li>
              <button
                onClick={() => navigate("/exercises")}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800"
              >
                <span className="text-xl">🏋️</span>
                {!collapsed && <span>Ejercicios</span>}
              </button>
            </li>
          </ul>
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-gray-700 flex items-center gap-3 cursor-pointer hover:bg-gray-800 rounded">
          <span className="text-xl">🌙</span>
          {!collapsed && <span className="text-sm font-medium">Oscuro</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;