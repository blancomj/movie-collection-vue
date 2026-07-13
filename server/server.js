const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });
const { initDatabase, closeDatabase } = require('./database');
const moviesRouter = require('./routes/movies');
const uploadRouter = require('./routes/upload');

const app = express();
const DEFAULT_BASE_PATH = '/peliculas';
const PORT = parseInt(process.env.PORT, 10) || 8080;
const BASE_PATH = process.env.BASE_PATH || DEFAULT_BASE_PATH;
const { POSTERS_DIR } = require('./paths');
const ENV_CONFIG = {
    PORT,
    BASE_PATH,
    DATABASE_PATH: process.env.DATABASE_PATH || process.env.DB_PATH || null,
    DATABASE_DIR: process.env.DATABASE_DIR || process.env.DB_DIR || null
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isProd = process.env.NODE_ENV === 'production';
const publicDir = isProd
    ? path.join(__dirname, '..', 'dist')
    : path.join(__dirname, '..', 'public');
// const postersDir = path.join(__dirname, 'posters');
const postersDir = POSTERS_DIR;

app.use(BASE_PATH, express.static(publicDir));
app.use(`${BASE_PATH}/posters`, express.static(postersDir));

app.use(`${BASE_PATH}/api/movies`, moviesRouter);
app.use(`${BASE_PATH}/api/upload`, uploadRouter);

app.post(`${BASE_PATH}/api/upload-file`, (req, res) => {
    const multer = require('multer');
    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, path.join(__dirname)),
        filename: (req, file, cb) => cb(null, 'upload_temp.txt')
    });
    const upload = multer({ storage });

    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, message: 'Archivo subido' });
    });
});

if (isProd) {
    app.get(`${BASE_PATH}/?*`, (req, res) => {
        const reqPath = req.path.replace(/^\/+/, '');
        const filePath = path.join(publicDir, reqPath || 'index.html');
        res.sendFile(filePath, (err) => {
            if (err) {
                res.sendFile(path.join(publicDir, 'index.html'));
            }
        });
    });
}

app.get('/', (req, res) => {
    res.redirect(BASE_PATH);
});

// Iniciar servidor con base de datos
async function startServer() {
    try {
        console.log('⚙️  Configuración de entorno:', JSON.stringify(ENV_CONFIG, null, 2));
        await initDatabase();
        console.log('💾 Base de datos inicializada');
        
        const server = app.listen(PORT, () => {
            console.log(`🎬 Movie Collection Server corriendo en http://localhost:${PORT}`);
            console.log(`📁 Frontend: ${path.join(__dirname, '..', 'public')}`);
            console.log(`💾 Database: ${process.env.DATABASE_PATH || process.env.DB_PATH || path.join(__dirname, 'movies.db')}`);
            console.log(`🖼️  Posters: ${path.join(__dirname, 'posters')}`);
        });

        server.on('error', (err) => {
            console.error('❌ Error al iniciar el servidor HTTP:', err);
            process.exit(1);
        });
    } catch (err) {
        console.error('❌ Error al iniciar servidor:', err);
        process.exit(1);
    }
}

startServer();

// Manejar cierre graceful
process.on('SIGINT', () => {
    closeDatabase();
    process.exit(0);
});

process.on('SIGTERM', () => {
    closeDatabase();
    process.exit(0);
});
