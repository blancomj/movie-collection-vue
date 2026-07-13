const path = require('path');

function resolveDir(envPath, envDir, defaultDirName, baseDir) {
    if (envPath) {
        return path.isAbsolute(envPath) ? envPath : path.join(baseDir, envPath);
    }
    if (envDir) {
        return path.isAbsolute(envDir) ? envDir : path.join(baseDir, envDir);
    }
    return path.join(baseDir, defaultDirName);
}

const POSTERS_DIR = resolveDir(
    process.env.POSTERS_PATH,
    process.env.POSTERS_DIR,
    'posters',
    __dirname // server/
);

module.exports = { POSTERS_DIR };