# Movie Collection Vue

Aplicación web para gestionar, explorar y organizar una colección de películas con Vue 3, Pinia, Tailwind CSS y un backend en Node.js/Express con base de datos local.

## ✨ Características

- Explorar películas desde una base local y desde TMDB
- Buscar por título, género, año, valoración y década
- Ver detalle de cada película con información, tráiler, reparto y películas similares
- Marcar películas como favoritas o deseadas
- Consultar estadísticas de la colección
- Configuración de la app y gestión de posters
- Diseño responsive con navegación adaptable

## 🛠️ Tecnologías

### Frontend
- Vue 3
- Vue Router
- Pinia
- Tailwind CSS
- Vite
- Axios

### Backend
- Node.js
- Express
- SQLite via sql.js
- Multer para subida de archivos
- CORS y dotenv

## 📋 Requisitos

- Node.js 18 o superior
- npm

## 🚀 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/blancomj/movie-collection-vue.git
cd movie-collection-vue
```

2. Instala las dependencias del frontend:

```bash
npm install
```

3. Instala las dependencias del backend:

```bash
cd server
npm install
cd ..
```

## ▶️ Ejecución en desarrollo

Abre dos terminales:

### Terminal 1: frontend
```bash
npm run dev
```

La app quedará disponible en:
- http://localhost:5173/peliculas/

### Terminal 2: backend
```bash
npm run dev:server
```

El servidor quedará disponible en:
- http://localhost:8080/peliculas/

## 🧱 Variables de entorno

El backend lee configuración desde el archivo `server/.env` si existe.

Ejemplo:

```env
PORT=8080
BASE_PATH=/peliculas
DATABASE_PATH=./server/movies.db
DATABASE_DIR=./server
TMDB_API_KEY=tu_api_key_aqui
```

### Opciones útiles
- `PORT`: puerto del backend
- `BASE_PATH`: prefijo base de la app
- `DATABASE_PATH`: ruta de la base de datos SQLite
- `DATABASE_DIR`: carpeta de la base de datos
- `TMDB_API_KEY`: clave API de TMDB (opcional, la app incluye una por defecto para pruebas)

## 🏗️ Construcción para producción

1. Genera la build del frontend:

```bash
npm run build
```

2. Inicia el servidor en modo producción:

```bash
npm run start
```

La aplicación queda disponible en:
- http://localhost:8080/peliculas/

## 📁 Estructura del proyecto

```text
.
├── public/               # Archivos estáticos y service worker
├── server/               # Backend Express y base de datos
│   ├── routes/           # Rutas de películas y uploads
│   ├── posters/          # Posters guardados localmente
│   └── server.js         # Punto de entrada del servidor
├── src/                  # Código fuente del frontend
│   ├── components/       # Componentes Vue reutilizables
│   ├── views/            # Vistas principales
│   ├── stores/           # Stores de Pinia
│   ├── api/              # Cliente y servicios API
│   └── router/           # Configuración de rutas
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🔗 Rutas principales

- `/peliculas/` → Inicio
- `/peliculas/movie/:id` → Detalle de película
- `/peliculas/favoritos` → Películas favoritas
- `/peliculas/deseadas` → Películas deseadas
- `/peliculas/estadisticas` → Estadísticas
- `/peliculas/configuracion` → Configuración

## 📝 Notas

- La base de datos se crea automáticamente al iniciar el backend.
- Los posters se almacenan en la carpeta `server/posters`.
- Si cambias el `BASE_PATH`, también debes ajustar la configuración de Vite y las rutas del backend.

## 🤝 Contribución

Si deseas colaborar:

1. Haz un fork del proyecto
2. Crea una rama para tu cambio
3. Realiza tus modificaciones
4. Abre un pull request

## 📄 Licencia

Este proyecto se distribuye bajo la licencia que determine el propietario del repositorio.
