'use strict';

var nbt = require('../nbt'),
    expect = require('chai').expect;

describe('nbt.Reader', function() {
	it('is constructed with a Uint8Array', function() {
		nbt.Reader(new Uint8Array([1, 2, 3]));
	});

	it('reads 8-bit bytes', function() {
		var reader = new nbt.Reader(new Uint8Array([0, 127, -127]));
		expect(reader.byte()).to.equal(0);
		expect(reader.byte()).to.equal(127);
		expect(reader.byte()).to.equal(-127);
	});

	it('reads 8-bit unsigned bytes', function() {
		var reader = new nbt.Reader(new Uint8Array([0, 127, 255]));
		expect(reader.ubyte()).to.equal(0);
		expect(reader.ubyte()).to.equal(127);
		expect(reader.ubyte()).to.equal(255);
	});

	it('reads 16-bit shorts', function() {
		var reader = new nbt.Reader(new Uint8Array([
			0,0, 0,255, -127,255
		]));
		expect(reader.short()).to.equal(0);
		expect(reader.short()).to.equal(255);
		expect(reader.short()).to.equal((-127 << 8) | 255);
	});

	it('reads 32-bit ints', function() {
		var reader = new nbt.Reader(new Uint8Array([
			0,0,0,0,
			0,0,0,255,
			-127,0,0,0
		]));
		expect(reader.int()).to.equal(0);
		expect(reader.int()).to.equal(255);
		expect(reader.int()).to.equal(-127 << 24);
	});

	it('reads 64-bit longs', function() {
		var reader = new nbt.Reader(new Uint8Array([
			0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,255,
			-127,0,0,0,0,0,0,0
		]));
		expect(reader.long()).to.deep.equal([0, 0]);
		expect(reader.long()).to.deep.equal([0, 255]);
		expect(reader.long()).to.deep.equal([-127 << 24, 0]);
	});

	it('reads 32-bit floats', function() {
		var reader = new nbt.Reader(new Uint8Array([
			0x00,0x00,0x00,0x00,
			0x3f,0x80,0x00,0x00
		]));
		expect(reader.float()).to.equal(0);
		expect(reader.float()).to.equal(1);
	});

	it('reads 64-bit doubles', function() {
		var reader = new nbt.Reader(new Uint8Array([
			0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
			0x3f,0xf0,0x00,0x00,0x00,0x00,0x00,0x00
		]));
		expect(reader.double()).to.equal(0);
		expect(reader.double()).to.equal(1);
	});

	it('reads 8-bit byte arrays', function() {
		var reader = new nbt.Reader(new Uint8Array([
			0,0,0,2, 1,2,
			0,0,0,4, 3,4,5,6
		]));
		expect(reader.byteArray()).to.deep.equal([1, 2]);
		expect(reader.byteArray()).to.deep.equal([3, 4, 5, 6]);
	});

	it('reads 32-bit int arrays', function() {
		var reader = new nbt.Reader(new Uint8Array([
			0,0,0,2, 0,0,0,1, 0,0,0,2,
			0,0,0,4, 0,0,0,3, 0,0,0,4, 0,0,0,5, 0,0,0,6,
		]));
		expect(reader.intArray()).to.deep.equal([1, 2]);
		expect(reader.intArray()).to.deep.equal([3, 4, 5, 6]);
	});

	it('reads 64-bit int arrays', function() {
		var reader = new nbt.Reader(new Uint8Array([
			0,0,0,1, 0,0,0,15, 0,0,0,1,
			0,0,0,2, 16,16,16,16, 32,32,32,32, 1,2,3,4, 5,6,7,8,
		]));
		expect(reader.longArray()).to.deep.equal([[15, 1]]);
		expect(reader.longArray()).to.deep.equal([[269488144, 538976288], [16909060, 84281096]]);
	});

	it('reads strings', function() {
		var reader = new nbt.Reader(new Uint8Array([
			0,6,  0x48,0x65,0x6C,0x6C,0x6F,0x21,
			0,16, 0xE3,0x81,0x93,0xE3,0x82,0x93,0xE3,0x81,
			      0xAB,0xE3,0x81,0xA1,0xE3,0x81,0xAF,0x21
		]));
		expect(reader.string()).to.equal('Hello!');
		expect(reader.string()).to.equal('こんにちは!');
	});

	it('reads lists', function() {
		var reader = new nbt.Reader(new Uint8Array([
			1, 0,0,0,3, 1, 2, 3,
			8, 0,0,0,2, 0,5, 0x48,0x65,0x6C,0x6C,0x6F,
			            0,5, 0x57,0x6F,0x72,0x6C,0x64
		]));
		expect(reader.list()).to.deep.equal(
			{ type: "byte", value: [1, 2, 3] });
		expect(reader.list()).to.deep.equal(
			{ type: "string", value: ['Hello', 'World'] });
	});

	it('reads compounds', function() {
		var reader = new nbt.Reader(new Uint8Array([
			1, 0,2, 0x61,0x61, 1,
			9, 0,2, 0x62,0x62, 1, 0,0,0,3, 1, 2, 3,
			0,
			1, 0,2, 0x63,0x63, 2,
			0
		]));
		expect(reader.compound()).to.deep.equal({
			aa: { type: "byte", value: 1 },
			bb: { type: "list", value: { type: "byte", value: [1, 2, 3] } }
		});
		expect(reader.compound()).to.deep.equal({
			cc: { type: "byte", value: 2 }
		});
	});

	it('tracks the cursor location', function() {
		var reader = new nbt.Reader(new Uint8Array([
			0, 0,0,0,0,0,0,0,0
		]));
		expect(reader.offset).to.equal(0);
		reader.byte();
		reader.long();
		expect(reader.offset).to.equal(9);
	});

	it('can change the cursor location', function() {
		var reader = new nbt.Reader(new Uint8Array([1, 2]));
		expect(reader.byte()).to.equal(1);
		reader.offset = 0;
		expect(reader.byte()).to.equal(1);
	});

	if (typeof Buffer !== 'undefined') {
		it('is supports Buffer input', function() {
			var reader = new nbt.Reader(new Uint8Array([1, 2, 3]));
			expect(reader.byte()).to.equal(1);
			expect(reader.byte()).to.equal(2);
			expect(reader.byte()).to.equal(3);
		});
	}
});
