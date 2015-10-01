'use strict';

var fs = require('fs'),
    nbt = require('../nbt'),
    expect = require('chai').expect;

describe('nbt.parse', function() {
	it('parses a compressed NBT file', function(done) {
		fs.readFile('sample/bigtest.nbt.gz', function(error, data) {
			if (error) {
				throw error;
			}
			nbt.parse(data, function(err, data) {
				if (err)
					throw error;
				expect(data.value.root).to.equal('Level');
				expect(data.value.value.stringTest.value).to.equal(
				'HELLO WORLD THIS IS A TEST STRING ÅÄÖ!');
				expect(data.value.value['nested compound test'].value).to.deep.equal({
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
				done();
			});
		});
	});
});

describe('nbt.write', function() {
	it('writes an uncompressed NBT file', function(done) {
		fs.readFile('sample/bigtest.nbt', function(err, nbtdata) {
			if (err)
				throw err;
			expect(nbt.writeUncompressed(require('../sample/bigtest'))).to.deep.equal(nbtdata);
			done();
		});
	});
});
