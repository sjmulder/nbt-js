const nbt = require('nbt')
const pako = require('pako')

/**
 * @callback gzipCallback
 * @param {Error} error
 * @param {ArrayBuffer|Buffer|Uint8Array} */

/**
 * @param {ArrayBuffer|Buffer|Uint8Array} data - uncrompressed data
 * @param {gzipCallback} callback */
nbt.gzip = function(data, callback) {
    try {
        callback(null, pako.gzip(data))
    } catch(error) {
        callback(error, null)
    }
}

/**
 * @callback gunzipCallback
 * @param {Error} error
 * @param {ArrayBuffer|Buffer|Uint8Array} */

/**
 * @param {ArrayBuffer|Buffer|Uint8Array} data - compressed data
 * @param {gunzipCallback} callback */
nbt.gunzip = function(data, callback) {
    try {
        callback(null, pako.ungzip(data))
    } catch(error) {
        callback(error, null)
    }
}

// ...then use nbt as normal
//