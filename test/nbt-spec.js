'use strict';

var fs = require('fs'),
    nbt = require('../nbt'),
    expect = require('chai').expect;

describe('nbt.parse', function() {
	function checkBigtest(data) {
		expect(data.value.stringTest.value).to.equal(
			'HELLO WORLD THIS IS A TEST STRING ÅÄÖ!');
		expect(data.value['nested compound test'].value).to.deep.equal({
			ham: {
				type: "compound",
				value: {
					name: { type: "string", value: "Hampus" },
					value: { type: "float", value: 0.75 }
				}
			},
			egg: {
				type: "compound",
				value: {
					name: { type: "string", value: 'Eggbert' },
					value: { type: "float", value: 0.5 }
				}
			}
		});
	}

	if (typeof zlib !== 'undefined') {
		it('parses a compressed NBT file', function(done) {
			fs.readFile('sample/bigtest.nbt.gz', function(error, data) {
				if (error) { throw error; }
				nbt.parse(data, function(err, data) {
					if (err) { throw err; }
					checkBigtest(data);
					done();
				});
			});
		});
	}

	if (typeof zlib !== 'undefined' && typeof Buffer !== 'undefined') {
		/* Only applicable on Node where fs.readFile returns a Buffer object
		   which has an ArrayBuffer .buffer attribute. */
		it('parses a compressed NBT ArrayBuffer', function(done) {
			fs.readFile('sample/bigtest.nbt.gz', function(error, data) {
				if (error) { throw error; }
				var buffer = data.buffer;
				nbt.parse(buffer, function(err, data) {
					if (err) { throw err; }
					checkBigtest(data);
					done();
				});
			});
		});
	}

	it('parses an uncompressed NBT file through parse()', function(done) {
		fs.readFile('sample/bigtest.nbt', function(error, data) {
			if (error) { throw error; }
			nbt.parse(data, function(error, data) {
				if (error) { throw error; }
				checkBigtest(data);
				done();
			});
		});
	});
});

describe('nbt.write', function() {
	it('writes an uncompressed NBT file', function(done) {
		fs.readFile('sample/bigtest.nbt', function(error, nbtData) {
			if (error) { throw error; }

			fs.readFile('sample/bigtest.json', 'utf8',
					function(error, jsonStr) {
				if (error) { throw error; }

				var input = JSON.parse(jsonStr);
				var output = nbt.writeUncompressed(input);
				expect(new Uint8Array(output)).to.deep.equal(
					new Uint8Array(nbtData));
				done();
			});
		});
	});

	it('re-encodes it input perfectly', function() {
		fs.readFile('sample/bigtest.json', 'utf8', function(error, jsonStr) {
			if (error) { throw error; }

			var input = JSON.parse(jsonStr);
			var output = nbt.writeUncompressed(input);
			var decodedOutput = nbt.parseUncompressed(output);
			expect(new Uint8Array(decodedOutput)).to.deep.equal(
				new Uint8Array(input));
		});
	});
});
