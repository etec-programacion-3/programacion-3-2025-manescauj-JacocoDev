import axios from "axios";

// ⚙️ Configuración base de la API
const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // ajustá el puerto si tu backend usa otro
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================
// 📦 Sesiones
// =====================

// Obtener todas las sesiones
export const getSessions = async () => {
  const res = await api.get("/sesiones");
  return res.data;
};

// Obtener una sesión por ID
export const getSessionById = async (id) => {
  const res = await api.get(`/sesiones/${id}`);
  return res.data;
};

// Crear una nueva sesión
export const createSession = async (data) => {
  const res = await api.post("/sesiones", data);
  return res.data;
};

// Actualizar una sesión existente
export const updateSession = async (id, data) => {
  const res = await api.put(`/sesiones/${id}`, data);
  return res.data;
};

// Eliminar una sesión
export const deleteSession = async (id) => {
  const res = await api.delete(`/sesiones/${id}`);
  return res.data;
};

// =====================
// 📦 Grupos musculares
// =====================

// Obtener grupos musculares
export const getGruposMusculares = async () => {
  const res = await api.get("/grupos-musculares");
  return res.data;
};

// Export por defecto, por si querés usar api directamente
export default api;