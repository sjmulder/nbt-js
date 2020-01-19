
const element = document.querySelector('#nbt_file')

element.addEventListener('change', ev => {
    loadFile(element.files[0])
})

function loadFile(file) {
    let reader = new FileReader()

    reader.onload = () => {
        nbt.parse(reader.result, (error, data) => {
            if (error) throw error

            console.log('Loaded nbt file, data:', data)

            let uncompressed = nbt.writeUncompressed(data)

            console.log('Wrote uncompressed', uncompressed)

            nbt.writeCompressed(data, (error, compressed) => {
                if (error) throw error

                console.log('Wrote compressed', compressed.buffer)

                nbt.parse(compressed, (error, dataRoundTwo) => {
                    if (error) throw error

                    console.log('Parsed compressed file again, data:', dataRoundTwo)
                })
            })
        })
    }

    reader.readAsArrayBuffer(file)
}