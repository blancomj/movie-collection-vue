const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { POSTERS_DIR } = require('../paths');
const { getAllMovies, getMovieById, upsertMovie, deleteMovie, searchMovies, getStats, getConfigValue, setConfigValue, getWantedMovies, toggleWanted } = require('../database');

// GET /api/movies - Obtener todas las películas
router.get('/', (req, res) => {
    try {
        const { search, genre, year, sort } = req.query;
        let movies = getAllMovies();

        // Filtro por búsqueda
        if (search) {
            const term = search.toLowerCase();
            movies = movies.filter(m =>
                (m.title && m.title.toLowerCase().includes(term)) ||
                (m.original_title && m.original_title.toLowerCase().includes(term)) ||
                (m.overview && m.overview.toLowerCase().includes(term))
            );
        }

        // Filtro por género
        if (genre) {
            movies = movies.filter(m =>
                m.genres && m.genres.some(g => g.id && g.id.toString() === genre)
            );
        }

        // Filtro por año
        if (year) {
            movies = movies.filter(m => m.year && m.year.toString() === year);
        }

        // Ordenamiento
        if (sort) {
            switch (sort) {
                case 'title.asc':
                    movies.sort((a, b) => (a.original_title || a.title || '').localeCompare(b.original_title || b.title || ''));
                    break;
                case 'title.desc':
                    movies.sort((a, b) => (b.original_title || b.title || '').localeCompare(a.original_title || a.title || ''));
                    break;
                case 'year.desc':
                    movies.sort((a, b) => (b.year || 0) - (a.year || 0));
                    break;
                case 'year.asc':
                    movies.sort((a, b) => (a.year || 0) - (b.year || 0));
                    break;
                case 'vote_average.desc':
                    movies.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
                    break;
                case 'vote_average.asc':
                    movies.sort((a, b) => (a.vote_average || 0) - (b.vote_average || 0));
                    break;
                default:
                    movies.sort((a, b) => (a.original_title || a.title || '').localeCompare(b.original_title || b.title || ''));
            }
        }

        res.json({
            success: true,
            total: movies.length,
            movies
        });
    } catch (error) {
        console.error('Error al obtener películas:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/movies/stats - Obtener estadísticas
router.get('/stats', (req, res) => {
    try {
        const stats = getStats();
        res.json({ success: true, ...stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/movies/wanted - Obtener películas deseadas
router.get('/wanted', (req, res) => {
    try {
        const movies = getWantedMovies();
        res.json({ success: true, total: movies.length, movies });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PATCH /api/movies/:id/wanted - Toggle estado deseada
router.patch('/:id/wanted', (req, res) => {
    try {
        const result = toggleWanted(parseInt(req.params.id));
        if (result === null) {
            return res.status(404).json({ success: false, error: 'Película no encontrada' });
        }
        res.json({ success: true, wanted: result.wanted });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/movies/:id - Obtener película por ID
router.get('/:id', (req, res) => {
    try {
        const movie = getMovieById(parseInt(req.params.id));
        if (!movie) {
            return res.status(404).json({ success: false, error: 'Película no encontrada' });
        }
        res.json({ success: true, movie });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/movies - Crear o actualizar película
router.post('/', (req, res) => {
    try {
        const movie = req.body;
        if (!movie.tmdb_id || !movie.title) {
            return res.status(400).json({ success: false, error: 'Se requiere tmdb_id y title' });
        }
        upsertMovie(movie);
        res.json({ success: true, message: 'Película guardada correctamente' });
    } catch (error) {
        console.error('Error saving movie:', error);
        res.status(500).json({ success: false, error: error.message || error.toString() });
    }
});

// POST /api/movies/batch - Crear múltiples películas
router.post('/batch', (req, res) => {
    try {
        const { movies } = req.body;
        if (!Array.isArray(movies)) {
            return res.status(400).json({ success: false, error: 'Se requiere un array de películas' });
        }
        const { upsertMovies } = require('../database');
        const count = upsertMovies(movies);
        res.json({ success: true, message: `${count} películas guardadas` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/movies/:id - Eliminar película
router.delete('/:id', (req, res) => {
    try {
        const result = deleteMovie(parseInt(req.params.id));
        if (result.changes === 0) {
            return res.status(404).json({ success: false, error: 'Película no encontrada' });
        }
        res.json({ success: true, message: 'Película eliminada' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/posters/:filename - Servir imagen de póster
// router.get('/posters/:filename', (req, res) => {
//     const posterPath = path.join(__dirname, '..', 'posters', req.params.filename);
router.get('/posters/:filename', (req, res) => {
    const posterPath = path.join(POSTERS_DIR, req.params.filename);
    if (fs.existsSync(posterPath)) {
        res.sendFile(posterPath);
    } else {
        res.status(404).json({ success: false, error: 'Póster no encontrado' });
    }
});

// TMDB Proxy
const https = require('https');
const TMDB_API_KEY = process.env.TMDB_API_KEY || '3d63bfb6f066ac6966021e75096f27c8';
const TMDB_BASE = 'https://api.themoviedb.org/3';

function tmdbFetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
            });
        }).on('error', reject);
    });
}

router.get('/tmdb/:id', async (req, res) => {
    try {
        const url = `${TMDB_BASE}/movie/${req.params.id}?api_key=${TMDB_API_KEY}&language=es`;
        const data = await tmdbFetch(url);
        if (data.success === false || data.StatusCode === 34) {
            return res.status(404).json({ success: false, error: 'Película no encontrada en TMDB' });
        }
        const movie = {
            tmdb_id: data.id,
            title: data.title,
            original_title: data.original_title,
            year: data.release_date ? new Date(data.release_date).getFullYear() : null,
            overview: data.overview,
            poster_path: data.poster_path,
            backdrop_path: data.backdrop_path,
            vote_average: data.vote_average,
            vote_count: data.vote_count,
            genres: data.genres || [],
            runtime: data.runtime || 0,
            release_date: data.release_date
        };
        res.json({ success: true, movie });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/tmdb/:id/similar', async (req, res) => {
    try {
        const url = `${TMDB_BASE}/movie/${req.params.id}/similar?api_key=${TMDB_API_KEY}&language=es&page=1`;
        const data = await tmdbFetch(url);
        res.json({ success: true, results: (data.results || []).slice(0, 10) });
    } catch (error) {
        res.json({ success: true, results: [] });
    }
});

router.get('/tmdb/:id/videos', async (req, res) => {
    try {
        const url = `${TMDB_BASE}/movie/${req.params.id}/videos?api_key=${TMDB_API_KEY}&language=es`;
        const data = await tmdbFetch(url);
        res.json({ success: true, results: data.results || [] });
    } catch (error) {
        res.json({ success: true, results: [] });
    }
});

router.get('/tmdb/:id/credits', async (req, res) => {
    try {
        const url = `${TMDB_BASE}/movie/${req.params.id}/credits?api_key=${TMDB_API_KEY}&language=es`;
        const data = await tmdbFetch(url);
        res.json({ success: true, cast: (data.cast || []).slice(0, 20) });
    } catch (error) {
        res.json({ success: true, cast: [] });
    }
});

router.get('/tmdb/:id/images', async (req, res) => {
    try {
        const url = `${TMDB_BASE}/movie/${req.params.id}/images?api_key=${TMDB_API_KEY}`;
        const data = await tmdbFetch(url);
        res.json({ success: true, backdrops: data.backdrops || [] });
    } catch (error) {
        res.json({ success: true, backdrops: [] });
    }
});

module.exports = router;
