const tar = require('tar');
const zlib = require('zlib');

/**
 * Unzip and untar a `.tar.gz` file.
 *
 * This function will first unzip using zlib, and then untar the content.
 * Once untar is completed, the binary is downloaded into `opts.binPath`.
 * It handles errors and successful completion using events.
 * onSuccess is called upon successful completion.
 */
function untar({ opts, req, onSuccess, onError }) {
    return new Promise((resolve, reject) => {
        const ungz = zlib.createGunzip();

        ungz.on('error', error => {
            if (onError) onError(error);
            reject(error);
        });

        const extractor = tar.extract({
            cwd: opts.binPath,
            onwarn: (code, message, data) => {
                console.warn(code, message, data);
            }
        });

        extractor.on('error', error => {
            if (onError) onError(error);
            reject(error);
        });

        extractor.on('finish', () => {
            if (onSuccess) onSuccess();
            resolve();
        });

        req.pipe(ungz).pipe(extractor);
    });
}

module.exports = untar;
