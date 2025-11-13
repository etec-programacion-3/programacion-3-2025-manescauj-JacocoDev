import React, { useEffect, useState } from "react";
import { getGruposMusculares, createSession } from "../services/api";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";

const SessionForm = ({ onCreated, onCancel }) => {
  const [fecha, setFecha] = useState(null);
  const [notas, setNotas] = useState("");
  const [gruposOptions, setGruposOptions] = useState([]);
  const [selectedGrupos, setSelectedGrupos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const data = await getGruposMusculares();
        const opts = data.map((g) => ({ value: g.id, label: g.nombre }));
        setGruposOptions(opts);
      } catch (err) {
        console.error("Error cargando grupos musculares:", err);
      }
    };
    fetchGrupos();
  }, []);

  const validate = () => {
    const e = {};
    if (!fecha) e.fecha = "La fecha es obligatoria.";
    if (!selectedGrupos || selectedGrupos.length === 0)
      e.grupos = "Seleccioná al menos un grupo muscular.";
    if (notas && notas.trim().length === 0)
      e.notas = "Las notas no pueden ser solo espacios.";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const localMidnight = new Date(
        fecha.getFullYear(),
        fecha.getMonth(),
        fecha.getDate(),
        0,
        0,
        0
      );

      const yyyy = localMidnight.getFullYear();
      const mm = String(localMidnight.getMonth() + 1).padStart(2, "0");
      const dd = String(localMidnight.getDate()).padStart(2, "0");

      const payload = {
        fecha: `${yyyy}-${mm}-${dd}`,
        notas: notas || null,
        grupo_ids: selectedGrupos.map((g) => g.value),
      };

      const newSession = await createSession(payload);
      if (newSession) onCreated(newSession);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.detail) {
        setErrores({ submit: String(err.response.data.detail) });
      } else {
        setErrores({ submit: "Error al crear la sesión." });
      }
    } finally {
      setLoading(false);
    }
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#fff",
      borderColor: "#ccc",
      color: "#111",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#fff",
      color: "#111",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#e0e7ff",
      color: "#111",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#dbeafe" : "#fff",
      color: "#111",
    }),
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gap: 12, color: "#111" }}>
        <label style={{ fontWeight: 600 }}>
          Fecha <span style={{ color: "red" }}>*</span>
        </label>
        <DatePicker
          selected={fecha}
          onChange={(date) => setFecha(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Seleccioná una fecha"
          maxDate={new Date()}
          isClearable
          todayButton="Hoy"
          popperPlacement="bottom"
          className="input"
          style={{
            background: "#fff",
            color: "#111",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        {errores.fecha && <p className="error-text">{errores.fecha}</p>}

        <label style={{ fontWeight: 600 }}>
          Grupos musculares <span style={{ color: "red" }}>*</span>
        </label>
        <Select
          options={gruposOptions}
          isMulti
          value={selectedGrupos}
          onChange={setSelectedGrupos}
          placeholder="Buscar y seleccionar grupos..."
          noOptionsMessage={() => "No hay grupos."}
          styles={customSelectStyles}
        />
        {errores.grupos && <p className="error-text">{errores.grupos}</p>}

        <label style={{ fontWeight: 600 }}>Notas (opcional)</label>
        <textarea
          rows="4"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Anotaciones sobre la sesión..."
          style={{
            resize: "vertical",
            padding: 8,
            background: "#fff",
            color: "#111",
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
        {errores.notas && <p className="error-text">{errores.notas}</p>}

        {errores.submit && <p className="error-text">{errores.submit}</p>}

        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            marginTop: 8,
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ddd",
              background: "#f3f4f6",
              cursor: "pointer",
            }}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "8px 14px",
              borderRadius: 6,
              border: "none",
              background: "#1d4ed8",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {loading ? "Guardando..." : "Guardar sesión"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SessionForm;