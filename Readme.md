**Note:** this repository is archived.

When I started this project, I was deeply involved with both Minecraft
and JavaScript. Since then, my involvement with both has waned and the
JavaScript landscape has moved at an incredible pace.

Without a clear vision and no dogfooding, I'm no longer the right
maintainer for this project and hence have archived this repository.
There are a good few forks out there which I encourage anyone to seek
out and give a try.

Apologetically yours,

Sijmen
___

NBT.js [![Build Status](https://travis-ci.org/sjmulder/nbt-js.png)](https://travis-ci.org/sjmulder/nbt-js)
======

By Sijmen Mulder and a host of wonderful contributors.

NBT.js is a JavaScript parser and serializer for [NBT](http://wiki.vg/NBT)
archives, for use with [Node.js](http://nodejs.org/) or the browser.


Usage
-----

After `var nbt = require('nbt')` or `<script src="nbt.js"></script>`, you can
use `nbt.parse(data, callback)` to convert NBT data into a regular JavaScript
object.

```js
var fs = require('fs'),
    nbt = require('nbt');

var data = fs.readFileSync('fixtures/bigtest.nbt.gz');
nbt.parse(data, function(error, data) {
    if (error) { throw error; }

    console.log(data.value.stringTest.value);
    console.log(data.value['nested compound test'].value);
});
```

If the data is gzipped, it is automatically decompressed first. When running
in the browser, `window.zlib` or [`window.pako`](https://github.com/nodeca/pako/) is required for this to work.

Tag names are copied verbatim, and as some names are not valid JavaScript
names, use of the indexer may be required – such as with the nested
compound test in the example above.


API documentation
-----------------

The full documentation generated with JSDoc is available in the docs/
directory and online:

http://sjmulder.github.io/nbt-js/


Development and testing
-----------------------

```bash
npm install  # Install development dependencies
make check   # Run tests
make watch   # Automatically runs 'make check' every few seconds
make doc     # Regenerate the documentation in docs/
```

Copyright
---------

I, the copyright holder of this work, hereby release it into the public
domain. This applies worldwide.

In case this is not legally possible: I grant anyone the right to use this
work for any purpose, without any conditions, unless such conditions are
required by law.
