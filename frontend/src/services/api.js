import axios from "axios";

// ⚙️ Configuración base de la API
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
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

// =====================
// EJERCICIOS
// =====================

export const getEjercicios = async (params = {}) => {
  const res = await api.get("/ejercicios", { params });
  return res.data;
};

export const getEjercicioById = async (id) => {
  const res = await api.get(`/ejercicios/${id}`);
  return res.data;
};

export const createEjercicio = async (data) => {
  const res = await api.post("/ejercicios", data);
  return res.data;
};

export const updateEjercicio = async (id, data) => {
  const res = await api.put(`/ejercicios/${id}`, data);
  return res.data;
};

export const deleteEjercicio = async (id) => {
  const res = await api.delete(`/ejercicios/${id}`);
  return res.data;
};

// =====================
// Ejercicios y Series relacionadas a una sesión
// =====================

// Obtener ejercicios disponibles para una sesión (filtrados por los grupos de la sesión)
export const getEjerciciosBySession = async (sessionId) => {
  const res = await api.get(`/sesiones/${sessionId}/ejercicios`);
  return res.data;
};

// Obtener series de una sesión
export const getSeriesBySession = async (sessionId) => {
  const res = await api.get(`/sesiones/${sessionId}/series`);
  return res.data;
};

// Crear una serie en una sesión
export const addSerieToSession = async (sessionId, data /* { ejercicio_id, repeticiones, peso } */) => {
  const res = await api.post(`/sesiones/${sessionId}/series`, data);
  return res.data;
};

// Actualizar serie existente
export const updateSerie = async (serieId, data /* { ejercicio_id, repeticiones, peso } */) => {
  const res = await api.put(`/series/${serieId}`, data);
  return res.data;
};

// Borrar serie
export const deleteSerie = async (serieId) => {
  const res = await api.delete(`/series/${serieId}`);
  return res.data;
};

// Export por defecto, por si querés usar api directamente
export default api;