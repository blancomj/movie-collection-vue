const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const { POSTERS_DIR } = require('../paths');
const { upsertMovie, setConfigValue } = require('../database');

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..'));
    },
    filename: (req, file, cb) => {
        cb(null, 'upload_temp.txt');
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.originalname.endsWith('.txt')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos .txt'));
        }
    }
});

// Configuración de TMDB
const TMDB_API_KEY = process.env.TMDB_API_KEY || '3d63bfb6f066ac6966021e75096f27c8';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const OMDB_API_KEY = '4a3b711b';

// POST /api/upload - Subir archivo y procesar películas
router.post('/', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No se subió ningún archivo' });
    }

    const filePath = path.join(__dirname, '..', 'upload_temp.txt');

    try {
        // Leer archivo
        const content = fs.readFileSync(filePath, 'utf-8');
        const movieNames = content.split('\n').filter(line => line.trim() !== '');

        res.json({
            success: true,
            message: `Archivo recibido. ${movieNames.length} películas para procesar.`,
            totalMovies: movieNames.length,
            movieNames
        });

        // Limpiar archivo temporal
        fs.unlinkSync(filePath);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/upload/process - Procesar películas (llamado desde el frontend)
router.post('/process', async (req, res) => {
    const { movieNames, startIndex = 0, batchSize = 5 } = req.body;

    if (!Array.isArray(movieNames)) {
        return res.status(400).json({ success: false, error: 'Se requiere un array de nombres' });
    }

    const results = [];
    const end = Math.min(startIndex + batchSize, movieNames.length);

    for (let i = startIndex; i < end; i++) {
        const movieName = movieNames[i].trim();
        try {
            const movieData = await searchMovieInTMDB(movieName);
            if (movieData) {
                // Obtener elenco
                const cast = await getMovieCast(movieData.tmdb_id);
                movieData.cast = cast;

                // Guardar en base de datos
                upsertMovie(movieData);

                // Descargar póster
                if (movieData.poster_path) {
                    const posterSaved = await downloadPoster(movieData.tmdb_id, movieData.poster_path);
                    if (posterSaved) {
                        movieData.local_poster = `/api/movies/posters/${movieData.tmdb_id}.jpg`;
                    }
                    upsertMovie(movieData);
                }

                results.push({ success: true, movie: movieData });
            } else {
                results.push({ success: false, name: movieName, error: 'No encontrada' });
            }
        } catch (error) {
            results.push({ success: false, name: movieName, error: error.message });
        }

        // Pausa entre requests
        if (i < end - 1) {
            await sleep(100);
        }
    }

    // Actualizar última actualización
    if (results.some(r => r.success)) {
        setConfigValue('last_update', new Date().toISOString());
    }

    res.json({
        success: true,
        processed: end - startIndex,
        total: movieNames.length,
        results
    });
});

// Buscar película en TMDB
async function searchMovieInTMDB(movieName) {
    const { title, year } = parseMovieName(movieName);
    if (!title) return null;

    const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}${year ? `&year=${year}` : ''}&language=en-US&include_adult=false`;

    const data = await fetchJSON(searchUrl);
    if (!data.results || data.results.length === 0) return null;

    const movie = data.results[0];
    const details = await getMovieDetails(movie.id);

    return {
        tmdb_id: movie.id,
        title: details.title || movie.title,
        original_title: movie.original_title,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
        overview: details.overview || movie.overview || 'Sin descripción',
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        genres: details.genres || [],
        runtime: details.runtime || 0,
        release_date: movie.release_date
    };
}

// Obtener detalles de película
async function getMovieDetails(movieId) {
    try {
        const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=es`;
        return await fetchJSON(url);
    } catch (error) {
        return { genres: [], runtime: 0 };
    }
}

// Obtener elenco de la película
async function getMovieCast(movieId) {
    try {
        const url = `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=es`;
        const data = await fetchJSON(url);
        if (data.cast && data.cast.length > 0) {
            return data.cast.slice(0, 10).map(actor => ({
                id: actor.id,
                name: actor.name,
                character: actor.character,
                profile_path: actor.profile_path
            }));
        }
        return [];
    } catch (error) {
        return [];
    }
}

// Descargar póster
async function downloadPoster(tmdbId, posterPath) {
    try {
        if (!posterPath) return false;
        const url = `https://image.tmdb.org/t/p/w500${posterPath}`;
        // const postersDir = path.join(__dirname, '..', 'posters');
        // if (!fs.existsSync(postersDir)) fs.mkdirSync(postersDir, { recursive: true });
        const postersDir = POSTERS_DIR;
        if (!fs.existsSync(postersDir)) fs.mkdirSync(postersDir, { recursive: true });
        const filePath = path.join(postersDir, `${tmdbId}.jpg`);

        return await downloadFile(url, filePath);
    } catch (error) {
        console.error('Error al descargar póster:', error);
        return false;
    }
}

// Descargar archivo genérico
function downloadFile(url, filePath) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        protocol.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                return downloadFile(response.headers.location, filePath).then(resolve).catch(reject);
            }
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }
            const stream = fs.createWriteStream(filePath);
            response.pipe(stream);
            stream.on('finish', () => { stream.close(); resolve(true); });
            stream.on('error', reject);
        }).on('error', reject);
    });
}

// Hacer fetch a URL y retorna JSON
function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        protocol.get(url, (response) => {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Parsear nombre de película
function parseMovieName(movieName) {
    let cleanName = movieName.trim();
    const match = cleanName.match(/^(.+?)\s*\((\d{4})\)$/);
    if (match) return { title: match[1].trim(), year: parseInt(match[2]) };
    const match2 = cleanName.match(/^(.+?)\s+(\d{4})$/);
    if (match2) return { title: match2[1].trim(), year: parseInt(match2[2]) };
    return { title: cleanName, year: null };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = router;
