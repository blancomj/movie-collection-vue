# Movie Collection - Colección de Películas

Aplicación web completa para gestionar, explorar y organizar una colección de películas. Migrada de HTML/CSS/JS vanilla a **Vue 3 + Pinia + Tailwind CSS**, desplegada en Hostinger.

## Características

- **Exploración de películas**: Grid responsive con posters, sinopsis y metadatos
- **Búsqueda y filtros**: Por título, género, año, valoración y década
- **Detalle de película**: Ficha completa con backdrop hero, sinopsis, información, reparto, tráiler, galería de fotogramas y películas similares
- **Favoritos**: Sistema de favoritos con almacenamiento local (localStorage) y botón de corazón en cada poster
- **Deseadas**: Lista de películas deseadas persistente en el servidor
- **Modo oscuro**: Toggle sol/luna en la barra de navegación
- **Películas similares**: Navegación entre películas similares con carga desde TMDB
- **Estadísticas**: Gráficas y métricas de la colección
- **Configuración**: Gestión de posters y ajustes de la aplicación
- **Responsive**: Diseño adaptable para escritorio, tablet y móvil
- **Despliegue**: Integración continua vía GitHub en Hostinger

## Stack Tecnológico

### Frontend
- **Vue 3** (Composition API, `<script setup>`)
- **Vue Router 4** (rutas lazy-loaded)
- **Pinia** (4 stores: movies, favorites, ui, wishlist)
- **Tailwind CSS 3** (tema personalizado con modo oscuro)
- **Vite 5** (dev server + proxy)
- **Axios** (cliente HTTP con interceptores)

### Backend
- **Node.js** (>=18)
- **Express 4**
- **SQLite** via `sql.js` (WASM, sin dependencias nativas)
- **Multer** para subida de archivos
- **CORS** y **dotenv**

### Externos
- **TMDB API** (información de películas, trailers, reparto, similares, imágenes)
- **OMDB API** (calificaciones)

## Requisitos

- Node.js 18 o superior
- npm

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/blancomj/movie-collection.git
cd movie-collection
```

2. Instala todas las dependencias (frontend + backend en un solo comando):

```bash
npm install
```

> **Nota**: Todas las dependencias (frontend y backend) están en el `package.json` raíz. No es necesario instalar separadamente en `server/`.

## Ejecución en Desarrollo

Abre dos terminales:

### Terminal 1: Frontend (Vite)

```bash
npm run dev
```

Disponible en: `http://localhost:5173/peliculas/`

### Terminal 2: Backend (Express)

```bash
npm run dev:server
```

Disponible en: `http://localhost:8080/peliculas/`

El proxy de Vite redirige `/peliculas/api` al backend automáticamente.

## Variables de Entorno

El backend lee configuración desde `server/.env`.

```env
PORT=8080
BASE_PATH=/peliculas
DATABASE_PATH=movies.db
TMDB_API_KEY=tu_api_key_aqui
```

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | `8080` |
| `BASE_PATH` | Prefijo base de la app | `/peliculas` |
| `DATABASE_PATH` | Ruta de la base de datos SQLite | `movies.db` |
| `DATABASE_DIR` | Directorio de la base de datos | `./server` |
| `TMDB_API_KEY` | Clave API de TMDB | `3d63bfb6f066ac6966021e75096f27c8` |
| `POSTERS_DIR` | Directorio de posters locales | `./server/posters` |

## Despliegue en Hostinger

La aplicación está desplegada en **Hostinger Hosting de Apps Web** con integración de GitHub.

### Configuración en Hostinger

- **Repositorio**: `https://github.com/blancomj/movie-collection.git`
- **Startup file**: `server/server.js`
- **Database path**: `/home/u434343788/sqlite/movies.db`
- **Build script**: Deshabilitado (`echo 'no build needed'`)
- **Dominio**: `movie.qodalab.tech/peliculas`

### Notas de despliegue

- El directorio `dist/` está commiteado en el repositorio (el build se ejecuta localmente)
- En producción, `server/server.js` sirve archivos estáticos desde `dist/`
- La base de datos se crea automáticamente al iniciar
- Se habilita SPA fallback para rutas de Vue Router

## Construcción para Producción

```bash
npm run build
npm run start
```

La aplicación queda disponible en: `http://localhost:8080/peliculas/`

## Estructura del Proyecto

```
.
├── public/                   # Archivos estáticos (favicon, PWA)
├── dist/                     # Build de producción (commiteado)
├── server/                   # Backend Express
│   ├── routes/
│   │   ├── movies.js         # Rutas CRUD + proxy TMDB
│   │   └── upload.js         # Subida y procesamiento de películas
│   ├── database.js           # Conexión SQLite via sql.js
│   ├── paths.js              # Resolución de rutas
│   ├── posters/              # Posters guardados localmente
│   ├── server.js             # Punto de entrada del servidor
│   └── .env                  # Variables de entorno
├── src/                      # Código fuente del frontend
│   ├── api/
│   │   ├── client.js         # Cliente Axios con interceptores
│   │   ├── movies.js         # Funciones API (CRUD, TMDB)
│   │   └── tmdb.js           # URLs de imágenes TMDB
│   ├── assets/
│   │   └── main.css          # Estilos globales + variables CSS
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.vue     # Barra superior (desktop)
│   │   │   ├── AppDrawer.vue     # Menu lateral
│   │   │   └── BottomNav.vue     # Navegación inferior (móvil)
│   │   ├── movie/
│   │   │   ├── MovieCard.vue     # Card de película en grid
│   │   │   ├── MovieGrid.vue     # Grid responsive de películas
│   │   │   ├── MovieHero.vue     # Hero con backdrop en ficha
│   │   │   ├── CastGrid.vue      # Grid de reparto
│   │   │   ├── BackdropGallery.vue # Galería de fotogramas
│   │   │   ├── SimilarMovies.vue # Películas similares
│   │   │   └── TrailerModal.vue  # Modal de tráiler
│   │   └── ui/
│   │       ├── FavoriteButton.vue  # Botón de corazón
│   │       ├── FilterControls.vue  # Controles de filtro
│   │       ├── SearchBar.vue       # Barra de búsqueda
│   │       ├── Pagination.vue      # Paginación
│   │       ├── LoadingSpinner.vue  # Spinner de carga
│   │       ├── StatsBar.vue        # Barra de estadísticas
│   │       ├── StatsPie.vue        # Gráfica circular
│   │       ├── TopLists.vue        # Listas destacadas
│   │       └── ActionButton.vue    # Botón de acción genérico
│   ├── composables/
│   │   ├── useNotifications.js  # Notificaciones toast
│   │   └── usePoster.js         # Resolución de URLs de poster
│   ├── router/
│   │   └── index.js             # Configuración de rutas
│   ├── stores/
│   │   ├── movies.js        # Store principal de películas
│   │   ├── favorites.js     # Favoritos (localStorage)
│   │   ├── wishlist.js      # Deseadas (servidor)
│   │   └── ui.js            # Tema, drawer, notificaciones
│   ├── views/
│   │   ├── HomeView.vue         # Página principal
│   │   ├── MovieDetailView.vue  # Ficha de película
│   │   ├── FavoritesView.vue    # Películas favoritas
│   │   ├── WantedView.vue       # Películas deseadas
│   │   ├── StatsView.vue        # Estadísticas
│   │   └── ConfigView.vue       # Configuración
│   ├── App.vue
│   └── main.js
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Endpoints de la API

### Películas (Base de datos local)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/movies` | Obtener películas (parámetros: `search`, `genre`, `year`, `sort`) |
| `GET` | `/api/movies/stats` | Estadísticas de la colección |
| `GET` | `/api/movies/wanted` | Películas deseadas |
| `GET` | `/api/movies/:id` | Obtener película por TMDB ID |
| `POST` | `/api/movies` | Crear/actualizar película |
| `POST` | `/api/movies/batch` | Crear/actualizar múltiples películas |
| `DELETE` | `/api/movies/:id` | Eliminar película |
| `PATCH` | `/api/movies/:id/wanted` | Alternar estado "deseada" |

### Proxy TMDB

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/movies/tmdb/:id` | Detalles de película desde TMDB |
| `GET` | `/api/movies/tmdb/:id/similar` | Películas similares (top 10) |
| `GET` | `/api/movies/tmdb/:id/videos` | Videos y tráileres |
| `GET` | `/api/movies/tmdb/:id/credits` | Reparto (top 20) |
| `GET` | `/api/movies/tmdb/:id/images` | Imágenes de fondo (backdrops) |

### Upload

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/upload` | Subir archivo .txt con nombres de películas |
| `POST` | `/api/upload/process` | Procesar películas por lotes vía TMDB |

## Rutas de la Aplicación

| Ruta | Vista |
|------|-------|
| `/peliculas/` | Inicio (grid de películas) |
| `/peliculas/movie/:id` | Detalle de película |
| `/peliculas/favoritos` | Películas favoritas |
| `/peliculas/deseadas` | Películas deseadas |
| `/peliculas/estadisticas` | Estadísticas de la colección |
| `/peliculas/configuracion` | Configuración |

## Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge (versiones modernas)
- **Dispositivos**: Escritorio, tablet, móvil
- **Sistemas operativos**: Windows, macOS, Linux

## Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu cambio (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus modificaciones
4. Commitea tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
5. Push a la rama (`git push origin feature/nueva-funcionalidad`)
6. Abre un Pull Request

## Licencia

Este proyecto se distribuye bajo la licencia que determine el propietario del repositorio.
