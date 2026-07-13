const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DATABASE_PATH = process.env.DATABASE_PATH || process.env.DB_PATH;
const DATABASE_DIR = process.env.DATABASE_DIR || process.env.DB_DIR;
let DB_PATH;

if (DATABASE_PATH) {
    DB_PATH = path.isAbsolute(DATABASE_PATH)
        ? DATABASE_PATH
        : path.join(__dirname, DATABASE_PATH);
} else if (DATABASE_DIR) {
    const dir = path.isAbsolute(DATABASE_DIR)
        ? DATABASE_DIR
        : path.join(__dirname, DATABASE_DIR);
    DB_PATH = path.join(dir, 'movies.db');
} else {
    DB_PATH = path.join(__dirname, 'movies.db');
}

const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

let db;
let SQL;

async function initDatabase() {
    if (db) return db;
    SQL = await initSqlJs();

    if (fs.existsSync(DB_PATH)) {
        const buffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(buffer);
    } else {
        db = new SQL.Database();
    }

    createTables();
    saveDatabase();
    return db;
}

function getDatabase() {
    if (!db) throw new Error('Database not initialized. Call initDatabase() first.');
    return db;
}

function saveDatabase() {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
}

function createTables() {
    db.run(`
        CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tmdb_id INTEGER UNIQUE,
            title TEXT NOT NULL,
            original_title TEXT,
            year INTEGER,
            overview TEXT,
            poster_path TEXT,
            backdrop_path TEXT,
            vote_average REAL DEFAULT 0,
            vote_count INTEGER DEFAULT 0,
            genres TEXT DEFAULT '[]',
            cast TEXT DEFAULT '[]',
            runtime INTEGER DEFAULT 0,
            release_date TEXT,
            local_poster TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS config (
            key TEXT PRIMARY KEY,
            value TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`CREATE INDEX IF NOT EXISTS idx_movies_title ON movies(title)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_movies_year ON movies(year)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_movies_vote ON movies(vote_average)`);

    // Add wanted column if not exists
    try {
        db.run(`ALTER TABLE movies ADD COLUMN wanted INTEGER DEFAULT 0`);
    } catch (e) {
        // Column already exists
    }
}

function getAllMovies() {
    const results = db.exec('SELECT * FROM movies ORDER BY original_title');
    if (!results.length) return [];
    return parseResults(results[0]).map(parseMovie);
}

function getMovieById(tmdbId) {
    const results = db.exec('SELECT * FROM movies WHERE tmdb_id = ?', [tmdbId]);
    if (!results.length || !results[0].values.length) return null;
    return parseMovie(parseSingleResult(results[0]));
}

function parseResults(result) {
    const columns = result.columns;
    return result.values.map(row => {
        const obj = {};
        columns.forEach((col, i) => { obj[col] = row[i]; });
        return obj;
    });
}

function parseSingleResult(result) {
    const columns = result.columns;
    const row = result.values[0];
    const obj = {};
    columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
}

function parseMovie(movie) {
    if (!movie) return null;
    return {
        ...movie,
        genres: JSON.parse(movie.genres || '[]'),
        cast: JSON.parse(movie.cast || '[]')
    };
}

function upsertMovie(movie) {
    const existing = getDatabase().exec('SELECT id FROM movies WHERE tmdb_id = ?', [movie.tmdb_id]);
    const isUpdate = existing.length && existing[0].values.length > 0;

    const title = movie.title || null;
    const originalTitle = movie.original_title || null;
    const year = movie.year || null;
    const overview = movie.overview || null;
    const posterPath = movie.poster_path || null;
    const backdropPath = movie.backdrop_path || null;
    const voteAvg = movie.vote_average || 0;
    const voteCount = movie.vote_count || 0;
    const genres = JSON.stringify(movie.genres || []);
    const cast = JSON.stringify(movie.cast || []);
    const runtime = movie.runtime || 0;
    const releaseDate = movie.release_date || null;
    const localPoster = movie.local_poster || null;

    if (isUpdate) {
        db.run(`
            UPDATE movies SET
                title = ?, original_title = ?, year = ?, overview = ?,
                poster_path = ?, backdrop_path = ?, vote_average = ?, vote_count = ?,
                genres = ?, cast = ?, runtime = ?, release_date = ?,
                local_poster = COALESCE(?, local_poster),
                updated_at = CURRENT_TIMESTAMP
            WHERE tmdb_id = ?
        `, [title, originalTitle, year, overview, posterPath, backdropPath, voteAvg, voteCount, genres, cast, runtime, releaseDate, localPoster, movie.tmdb_id]);
    } else {
        db.run(`
            INSERT INTO movies (tmdb_id, title, original_title, year, overview, poster_path, backdrop_path, vote_average, vote_count, genres, cast, runtime, release_date, local_poster)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [movie.tmdb_id, title, originalTitle, year, overview, posterPath, backdropPath, voteAvg, voteCount, genres, cast, runtime, releaseDate, localPoster]);
    }

    saveDatabase();
    return { changes: 1 };
}

function upsertMovies(movies) {
    let count = 0;
    for (const movie of movies) {
        const existing = getDatabase().exec('SELECT id FROM movies WHERE tmdb_id = ?', [movie.tmdb_id]);
        const isUpdate = existing.length && existing[0].values.length > 0;

        if (isUpdate) {
            db.run(`
                UPDATE movies SET
                    title = ?, original_title = ?, year = ?, overview = ?,
                    poster_path = ?, backdrop_path = ?, vote_average = ?, vote_count = ?,
                    genres = ?, cast = ?, runtime = ?, release_date = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE tmdb_id = ?
            `, [
                movie.title, movie.original_title, movie.year, movie.overview,
                movie.poster_path, movie.backdrop_path, movie.vote_average || 0, movie.vote_count || 0,
                JSON.stringify(movie.genres || []), JSON.stringify(movie.cast || []),
                movie.runtime || 0, movie.release_date, movie.tmdb_id
            ]);
        } else {
            db.run(`
                INSERT INTO movies (tmdb_id, title, original_title, year, overview, poster_path, backdrop_path, vote_average, vote_count, genres, cast, runtime, release_date, local_poster)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                movie.tmdb_id, movie.title, movie.original_title, movie.year, movie.overview,
                movie.poster_path, movie.backdrop_path, movie.vote_average || 0, movie.vote_count || 0,
                JSON.stringify(movie.genres || []), JSON.stringify(movie.cast || []),
                movie.runtime || 0, movie.release_date, null
            ]);
        }
        count++;
    }
    saveDatabase();
    return count;
}

function deleteMovie(tmdbId) {
    const changes = db.exec('DELETE FROM movies WHERE tmdb_id = ?', [tmdbId]);
    saveDatabase();
    return { changes: 1 };
}

function searchMovies(query) {
    const searchTerm = `%${query}%`;
    const results = db.exec(`
        SELECT * FROM movies
        WHERE title LIKE ? OR original_title LIKE ? OR overview LIKE ?
        ORDER BY original_title
    `, [searchTerm, searchTerm, searchTerm]);
    if (!results.length) return [];
    return parseResults(results[0]).map(parseMovie);
}

function getConfigValue(key) {
    const results = db.exec('SELECT value FROM config WHERE key = ?', [key]);
    if (!results.length || !results[0].values.length) return null;
    return results[0].values[0][0];
}

function setConfigValue(key, value) {
    const existing = db.exec('SELECT key FROM config WHERE key = ?', [key]);
    const isUpdate = existing.length && existing[0].values.length > 0;

    if (isUpdate) {
        db.run('UPDATE config SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?', [String(value), key]);
    } else {
        db.run('INSERT INTO config (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)', [key, String(value)]);
    }
    saveDatabase();
}

function getStats() {
    const results = db.exec('SELECT COUNT(*) as total FROM movies');
    const total = results.length ? results[0].values[0][0] : 0;
    const lastUpdate = getConfigValue('last_update');
    return { total, lastUpdate };
}

function getWantedMovies() {
    const results = db.exec('SELECT * FROM movies WHERE wanted = 1 ORDER BY original_title');
    if (!results.length) return [];
    return parseResults(results[0]).map(parseMovie);
}

function toggleWanted(tmdbId) {
    const current = db.exec('SELECT wanted FROM movies WHERE tmdb_id = ?', [tmdbId]);
    if (!current.length || !current[0].values.length) return null;
    const isWanted = current[0].values[0][0] ? 1 : 0;
    const newVal = isWanted ? 0 : 1;
    db.run('UPDATE movies SET wanted = ?, updated_at = CURRENT_TIMESTAMP WHERE tmdb_id = ?', [newVal, tmdbId]);
    saveDatabase();
    return { wanted: newVal === 1 };
}

function isWanted(tmdbId) {
    const results = db.exec('SELECT wanted FROM movies WHERE tmdb_id = ?', [tmdbId]);
    if (!results.length || !results[0].values.length) return false;
    return results[0].values[0][0] === 1;
}

function closeDatabase() {
    if (db) {
        saveDatabase();
        db.close();
        db = null;
    }
}

module.exports = {
    initDatabase,
    getDatabase,
    getAllMovies,
    getMovieById,
    upsertMovie,
    upsertMovies,
    deleteMovie,
    searchMovies,
    getConfigValue,
    setConfigValue,
    getStats,
    getWantedMovies,
    toggleWanted,
    isWanted,
    closeDatabase
};
