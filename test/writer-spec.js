'use strict';

var nbt = require('../nbt'),
    expect = require('chai').expect;

describe('nbt.Writer', function() {
	it('is constructed with no arguments', function() {
		nbt.Writer();
	});

	it('writes 8-bit bytes', function() {
		var writer = new nbt.Writer();
		expect(writer.byte(0).buffer.toString('hex')).to.deep.equal(new Buffer([0]).toString('hex'));
		expect(writer.byte(127).buffer).to.deep.equal(new Buffer([0, 127]));
		expect(writer.byte(-127).buffer).to.deep.equal(new Buffer([0, 127, -127]));
	});

	it('writes 16-bit shorts', function() {
		var writer = new nbt.Writer();
		expect(writer.short(0).buffer).to.deep.equal(new Buffer([0, 0]));
		expect(writer.short(255).buffer).to.deep.equal(new Buffer([0, 0, 0, 255]));
		expect(writer.short((-127 << 8) | 255).buffer).to.deep.equal(new Buffer([0, 0, 0, 255, -127, 255]));
	});

	it('writes 32-bit ints', function() {
		var writer = new nbt.Writer();
		expect(writer.int(0).buffer).to.deep.equal(new Buffer([0, 0, 0, 0]));
		expect(writer.int(255).buffer).to.deep.equal(new Buffer([0, 0, 0, 0, 0, 0, 0, 255]));
		expect(writer.int(-127 << 24).buffer).to.deep.equal(new Buffer([0, 0, 0, 0, 0, 0, 0, 255, -127, 0, 0, 0]));
	});

	it('writes 64-bit longs', function() {
		var writer = new nbt.Writer();
		var buffer = new Buffer([
			0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,255,
			-127,0,0,0,0,0,0,0
		]);
		expect(writer.long([0, 0]).buffer).to.deep.equal(buffer.slice(0, 8));
		expect(writer.long([0, 255]).buffer).to.deep.equal(buffer.slice(0, 16));
		expect(writer.long([-127 << 24, 0]).buffer).to.deep.equal(buffer);
	});

	it('writes 32-bit floats', function() {
		var writer = new nbt.Writer();
		var buffer = new Buffer([
			0x00,0x00,0x00,0x00,
			0x3f,0x80,0x00,0x00
		]);
		expect(writer.float(0).buffer).to.deep.equal(buffer.slice(0, 4));
		expect(writer.float(1).buffer).to.deep.equal(buffer);
	});

	it('writes 64-bit doubles', function() {
		var writer = new nbt.Writer();
		var buffer = new Buffer([
			0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
			0x3f,0xf0,0x00,0x00,0x00,0x00,0x00,0x00
		]);
		expect(writer.double(0).buffer).to.deep.equal(buffer.slice(0, 8));
		expect(writer.double(1).buffer).to.deep.equal(buffer);
	});

	it('writes 8-bit byte arrays from buffers', function() {
		var writer = new nbt.Writer();
		var buffer = new Buffer([
			0,0,0,2, 1,2,
			0,0,0,4, 3,4,5,6
		]);
		expect(writer.byteArray(new Buffer([1, 2])).buffer).to.deep.equal(buffer.slice(0, 6));
		expect(writer.byteArray(new Buffer([3, 4, 5, 6])).buffer).to.deep.equal(buffer);
	});

	it('writes 8-bit byte arrays from plain arrays', function() {
		var writer = new nbt.Writer();
		var buffer = new Buffer([
			0,0,0,2, 1,2,
			0,0,0,4, 3,4,5,6
		]);
		expect(writer.byteArray([1, 2]).buffer).to.deep.equal(buffer.slice(0, 6));
		expect(writer.byteArray([3, 4, 5, 6]).buffer).to.deep.equal(buffer);
	});

	it('writes 32-bit int arrays', function() {
		var writer = new nbt.Writer();
		var buffer = new Buffer([
			0,0,0,2, 0,0,0,1, 0,0,0,2,
			0,0,0,4, 0,0,0,3, 0,0,0,4, 0,0,0,5, 0,0,0,6,
		]);
		expect(writer.intArray([1, 2]).buffer).to.deep.equal(buffer.slice(0, 12));
		expect(writer.intArray([3, 4, 5, 6]).buffer).to.deep.equal(buffer);
	});

	it('writes strings', function() {
		var writer = new nbt.Writer();
		var buffer = new Buffer([
			0,6,  0x48,0x65,0x6C,0x6C,0x6F,0x21,
			0,16, 0xE3,0x81,0x93,0xE3,0x82,0x93,0xE3,0x81,
			      0xAB,0xE3,0x81,0xA1,0xE3,0x81,0xAF,0x21
		]);
		expect(writer.string('Hello!').buffer).to.deep.equal(buffer.slice(0, 8));
		expect(writer.string('こんにちは!').buffer).to.deep.equal(buffer);
	});

	it('writes lists', function() {
		var writer = new nbt.Writer();
		var buffer = new Buffer([
			1, 0,0,0,3, 1, 2, 3,
			8, 0,0,0,2, 0,5, 0x48,0x65,0x6C,0x6C,0x6F,
			            0,5, 0x57,0x6F,0x72,0x6C,0x64
		]);
		expect(writer.list({ type: "byte", value: [1, 2, 3] }).buffer).to.deep.equal(buffer.slice(0, 8));
		expect(writer.list({ type: "string", value: ['Hello', 'World'] }).buffer).to.deep.equal(buffer);
	});

	it('writes compounds', function() {
		var writer = new nbt.Writer();
		var buffer = new Buffer([
			1, 0,2, 0x61,0x61, 1,
			9, 0,2, 0x62,0x62, 1, 0,0,0,3, 1, 2, 3,
			0,
			1, 0,2, 0x63,0x63, 2,
			0
		]);
		expect(writer.compound({
			aa: { type: "byte", value: 1 },
			bb: { type: "list", value: { type: "byte", value: [1, 2, 3] } }
		}).buffer.toString('hex')).to.deep.equal(buffer.slice(0, 20).toString('hex'));
		expect(writer.compound({
			cc: { type: "byte", value: 2 }
		}).buffer).to.deep.equal(buffer);
	});
	
	it('tracks the number of bytes written', function() {
		var writer = new nbt.Writer();
		expect(writer.offset).to.equal(0);
		writer.byte(12);
		writer.long([34, 56]);
		expect(writer.offset).to.equal(9);
	});

	it('can seek to a location within the buffer', function() {
		var writer = new nbt.Writer();
		writer.short(0x1234);
		writer.offset = 1;
		writer.short(0x5678);
		expect(writer.buffer).to.deep.equal(new Buffer([0x12, 0x56, 0x78]));
	});

	it('can seek to a location beyond the buffer', function() {
		var writer = new nbt.Writer();
		writer.short(0x1234);
		writer.offset = 3;
		writer.short(0x5678);
		expect(writer.buffer).to.deep.equal(new Buffer([0x12, 0x34, 0x00, 0x56, 0x78]));
	});
});

