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
			var data = fs.readFileSync('fixtures/bigtest.nbt.gz');
			nbt.parse(data, function(err, data) {
				if (err) { throw err; }
				checkBigtest(data);
				done();
			});
		});
	}

	if (typeof zlib !== 'undefined' && typeof Buffer !== 'undefined') {
		/* Only applicable on Node where fs.readFile returns a Buffer object
		   which has an ArrayBuffer .buffer attribute. */
		it('parses a compressed NBT ArrayBuffer', function(done) {
			var data = fs.readFileSync('fixtures/bigtest.nbt.gz');
			var buffer = data.buffer;
			nbt.parse(buffer, function(err, data) {
				if (err) { throw err; }
				checkBigtest(data);
				done();
			});
		});
	}

	it('parses an uncompressed NBT file through parse()', function(done) {
		var data = fs.readFileSync('fixtures/bigtest.nbt');
		nbt.parse(data, function(error, data) {
			if (error) { throw error; }
			checkBigtest(data);
			done();
		});
	});

	it('parses an NBT file contining a long array', function(done) {
		var data = fs.readFileSync('fixtures/longArrayTest.nbt.gz');
		nbt.parse(data, function(error, data) {
			if (error) { throw error; }
			expect(data.value).to.deep.equal({
				LongArray: {
					type: 'longArray',
					value: [[1, 15], [538976288, 269488144], [84281096, 16909060]] // should be value: [[15, 1], [269488144, 538976288], [16909060, 84281096]]
				}
			});
			done();
		});
	});
});

describe('nbt.write', function() {
	it('writes an uncompressed NBT file', function() {
		var nbtData = fs.readFileSync('fixtures/bigtest.nbt');
		var jsonStr = fs.readFileSync('fixtures/bigtest.json', 'utf8');
		var input = JSON.parse(jsonStr);
		var output = nbt.writeUncompressed(input);
		expect(new Uint8Array(output)).to.deep.equal(
			new Uint8Array(nbtData));
	});

	it('re-encodes it input perfectly', function() {
		var jsonStr = fs.readFileSync('fixtures/bigtest.json', 'utf8');
		var input = JSON.parse(jsonStr);
		var output = nbt.writeUncompressed(input);
		var decodedOutput = nbt.parseUncompressed(output);
		expect(new Uint8Array(decodedOutput)).to.deep.equal(
			new Uint8Array(input));
	});
});
