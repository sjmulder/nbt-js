'use strict';

var fs = require('fs'),
	nbt = require('../nbt');

fs.readFile('../fixtures/bigtest.nbt.gz', function(error, data) {
	if (error) {
		throw error;
	}

	nbt.parse(data, function(error, data) {
		console.log(data.value.stringTest.value);
		console.log(data.value['nested compound test'].value);
	});
});
