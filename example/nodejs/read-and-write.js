const fs = require('fs')
const nbt = require('../../nbt')

// Set file dir to working dir so that we can use relative paths
process.chdir(__dirname)

let fileDataBuffer = fs.readFileSync('../../fixtures/bigtest.nbt.gz')

console.log('%s is compressed: %s', fileDataBuffer.constructor.name, isCompressed(fileDataBuffer))
// -> "Buffer is compressed: true"

// Parse Buffer into JavaScript object
nbt.parse(fileDataBuffer, function(error, nbtObject) {
    if (error) throw(error)

    // Write nbtObject to uncompressed ArrayBuffer
    let uncompressed = nbt.writeUncompressed(nbtObject)

    console.log('%s is compressed: %s', uncompressed.constructor.name, isCompressed(uncompressed))
    // -> "ArrayBuffer is compressed: true"

    // Write uncompressed ArrayBuffer to file
    // (NOTE: Converted to Buffer before write)
    fs.writeFileSync('output.uncompressed.nbt', Buffer.from(uncompressed))


    // Write nbtObject to compressed Buffer
    nbt.writeCompressed(nbtObject, function(error, compressed) {
        if (error) throw(error)

        console.log('%s is compressed: %s', compressed.constructor.name, isCompressed(compressed))
        // -> "Buffer is compressed: true"

        // Write compressed Buffer (must be Buffer; ArrayBuffer will not work) to file
        fs.writeFileSync('output.compressed.nbt', compressed)
    })
})

// Function for checking if buffer data is gzipped compressed
function isCompressed(bufferData) {
    let head = new Uint8Array(bufferData.slice(0, 2))
    return head.length === 2 && head[0] == 0x1f && head[1] == 0x8b
}