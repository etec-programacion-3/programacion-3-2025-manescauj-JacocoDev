# Página de Gestión de Entrenamientos

## 🧠 Descripción del Proyecto

Este proyecto es una aplicación web para la gestión de entrenamientos, con frontend en React y backend en FastAPI. Permite:

- Registrar y consultar sesiones de entrenamiento.
- Gestionar ejercicios y grupos musculares (crear, editar y eliminar).
- Registrar series de cada ejercicio dentro de una sesión (peso y repeticiones).
- Navegar entre las distintas secciones mediante un sidebar.
- Conectar ambos entornos mediante API REST, sin hardcodear datos en el frontend.

El objetivo es practicar desarrollo fullstack, manejo de estado en React, consumo de API REST y persistencia de datos con SQLite.

---

## 📂 Estructura del Proyecto

### Backend
```plaintext
backend/
├─ app/
│  ├─ __pycache__/
│  ├─ database/
│  │  └─ db.sqlite3
│  ├─ main.py
│  ├─ models.py
│  ├─ routes.py
│  └─ schemas.py
├─ README.md
├─ requests.http
└─ requirements.txt
Frontend
plaintext
Copy code
frontend/
├─ public/
│  └─ vite.svg
├─ src/
│  ├─ assets/
│  │  └─ react.svg
│  ├─ components/
│  │  ├─ AddExerciseModal.jsx
│  │  ├─ ExerciseForm.jsx
│  │  ├─ ExerciseTable.jsx
│  │  ├─ Header.jsx
│  │  ├─ Modal.jsx
│  │  ├─ MuscleGroupForm.jsx
│  │  ├─ MuscleGroupTable.jsx
│  │  ├─ SerieTable.jsx
│  │  ├─ SessionCard.jsx
│  │  ├─ SessionForm.jsx
│  │  ├─ SessionList.jsx
│  │  └─ Sidebar.jsx
│  ├─ pages/
│  │  ├─ ExercisesPage.jsx
│  │  ├─ HomePage.jsx
│  │  ├─ MuscleGroupsPage.jsx
│  │  └─ SessionPage.jsx
│  ├─ services/
│  │  └─ api.js
│  ├─ App.jsx
│  ├─ App.css
│  ├─ main.jsx
│  └─ index.css
├─ .gitignore
├─ eslint.config.js
├─ index.html
├─ package.json
├─ package-lock.json
├─ vite.config.js
└─ README.md
📝 Notas Técnicas
Backend: FastAPI

ORM: Tortoise ORM

Base de datos: SQLite

Frontend: React + Vite

Cliente HTTP: Axios

⚙️ Instalación y Ejecución (Linux)
1. Backend
a) Crear entorno virtual
bash
Copy code
cd backend
python3 -m venv venv
source venv/bin/activate
b) Instalar dependencias
bash
Copy code
pip install -r requirements.txt
c) Inicializar base de datos SQLite
El archivo db.sqlite3 ya está incluido en app/database/.

Para reiniciar la base de datos:

bash
Copy code
rm app/database/db.sqlite3
python
>>> from app.models import init_db
>>> init_db()
>>> exit()
d) Levantar el servidor FastAPI
bash
Copy code
uvicorn app.main:app --reload
Backend disponible en:
👉 http://127.0.0.1:8000

2. Frontend
bash
Copy code
cd ../frontend
npm install
npm run dev
La app se levantará en:
👉 http://localhost:5173
(Vite mostrará el puerto exacto)

3. Archivo de pruebas del Backend
El archivo:

bash
Copy code
backend/requests.http
Incluye:

CRUD de ejercicios

CRUD de grupos musculares

CRUD de sesiones

Compatible con REST Client (VS Code)

Ejecutarlo reflejará el estado actual de la base de datos.

4. Uso de la aplicación
🏠 HomePage
Muestra el historial de sesiones.

Permite crear nuevas sesiones.

Permite navegar a Ejercicios, Grupos Musculares y cada SessionPage.

💪 Ejercicios
Crear, editar y eliminar ejercicios.

Elegir su grupo muscular.

🧩 Grupos Musculares
Crear, editar y eliminar grupos musculares.

📘 SessionPage
Agregar ejercicios según el grupo muscular.

Agregar series indicando peso y repeticiones.

5. Comandos útiles
bash
Copy code
# Backend
uvicorn app.main:app --reload

# Frontend
npm run dev

# Reiniciar base de datos
rm app/database/db.sqlite3
python
>>> from app.models import init_db
>>> init_db()