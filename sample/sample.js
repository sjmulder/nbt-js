'use strict';

var fs = require('fs'),
	nbt = require('../nbt');

fs.readFile('bigtest.nbt.gz', function(error, data) {
	if (error) {
		throw error;
	}

	nbt.parse(data, function(error, data) {
		console.log(data.Level.stringTest.value);
		console.log(data.Level['nested compound test'].value);
	});
});
