'use strict'

const fs = require('fs')
const nbt = require('../nbt')

let nbtData = {
    name:'',
    value: {
        numberOfSomething: { type:'int', value:69 },
        people: { type:'list', value:{
            type: "compound",
            value: [
                { name: { type:'string', value:'Bob' }, age: { type:'int', value:25 } },
                { name: { type:'string', value:'Rob' }, age: { type:'int', value:47 } }
            ] }
        }
    }
}

let arrayBuffer = nbt.writeUncompressed(nbtData)
let buffer = Buffer.from(arrayBuffer) // convert from ArrayBuffer to writeable Buffer

fs.writeFileSync('output.nbt', buffer)
