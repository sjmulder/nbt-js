const fs = require('fs')
const nbt = require('../../nbt')

// Set file dir to working dir so that we can use relative paths
process.chdir(__dirname)

let fileDataBuffer = fs.readFileSync('../../fixtures/bigtest.nbt.gz')

// Parse Buffer into JavaScript object
nbt.parse(fileDataBuffer, function(error, namedCompound) {
    if (error) throw(error)

    console.log(namedCompound.value['listTest (compound)'].value.value[0].name.value)
    // -> "Compound tag #0"

    let shrinkedCompound = nbt.shrinkCompound(namedCompound)

    console.log(shrinkedCompound['listTest (compound)'][0].name)
    // -> "Compound tag #0"

    let grownCompound = nbt.growCompound(shrinkedCompound)
    
    console.log(grownCompound.value['listTest (compound)'].value.value[0].name.value)
    console.log(JSON.stringify(grownCompound))
    // -> "Compound tag #0"
})