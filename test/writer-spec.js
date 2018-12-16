'use strict';

var nbt = require('../nbt'),
    expect = require('chai').expect;

describe('nbt.Writer', function() {
	it('is constructed with no arguments', function() {
		nbt.Writer();
	});

	it('writes 8-bit bytes', function() {
		var writer = new nbt.Writer();
		writer.byte(0);
		writer.byte(127);
		writer.byte(-127);

		expect(new Uint8Array(writer.getData())).to.deep.equal(
			new Uint8Array([
				0, 127, 129
			]));
	});

	it('writes 8-bit unsigned bytes', function() {
		var writer = new nbt.Writer();
		writer.ubyte(0);
		writer.ubyte(127);
		writer.ubyte(255);

		expect(new Uint8Array(writer.getData())).to.deep.equal(
			new Uint8Array([
				0, 127, 255
			]));
	});

	it('writes 16-bit shorts', function() {
		var writer = new nbt.Writer();
		writer.short(0);
		writer.short(255);
		writer.short((-127 << 8) | 255);

		expect(new Uint8Array(writer.getData())).to.deep.equal(
			new Uint8Array([
				0, 0,
				0, 255,
				129, 255
			]));
	});

	it('writes 32-bit ints', function() {
		var writer = new nbt.Writer();
		writer.int(0);
		writer.int(255);
		writer.int(-127 << 24);

		expect(new Uint8Array(writer.getData())).to.deep.equal(
			new Uint8Array([
				0, 0, 0, 0,
				0, 0, 0, 255,
				129, 0, 0, 0
			]));
	});

	it('writes 64-bit longs', function() {
		var writer = new nbt.Writer();
		writer.long([0, 0]);
		writer.long([0, 255]);
		writer.long([-127 << 24, 0]);

		expect(new Uint8Array(writer.getData())).to.deep.equal(
			new Uint8Array([
				0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 255,
				129, 0, 0, 0, 0, 0, 0, 0
			]));
	});

	it('writes 32-bit floats', function() {
		var writer = new nbt.Writer();
		writer.float(0);
		writer.float(1);

		expect(new Uint8Array(writer.getData())).to.deep.equal(
			new Uint8Array([
				0x00, 0x00, 0x00, 0x00,
				0x3F, 0x80, 0x00, 0x00
			]));
	});

	it('writes 64-bit doubles', function() {
		var writer = new nbt.Writer();
		writer.double(0);
		writer.double(1);

		expect(new Uint8Array(writer.getData())).to.deep.equal(
			new Uint8Array([
				0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
				0x3F, 0xF0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			]));
	});

	it('writes 8-bit byte arrays from typed arrays', function() {
		var writer = new nbt.Writer();
		writer.byteArray(new Uint8Array([1, 2]));
		writer.byteArray(new Uint8Array([3,4, 5, 6]));

		expect(new Uint8Array(writer.getData())).to.deep.equal(
			new Uint8Array([
				0,0,0,2, 1,2,
				0,0,0,4, 3,4,5,6
			]));
	});

	it('writes 8-bit byte arrays from plain arrays', function() {
		var writer = new nbt.Writer();
		writer.byteArray([1, 2]);
		writer.byteArray([3,4, 5, 6]);

		expect(new Uint8Array(writer.getData())).to.deep.equal(
			new Uint8Array([
				0,0,0,2, 1,2,
				0,0,0,4, 3,4,5,6
			]));
	});

	it('writes 32-bit int arrays', function() {
		var writer = new nbt.Writer();
		writer.intArray([1, 2]);
		writer.intArray([3,4, 5, 6]);

		expect(new Uint8Array(writer.getData())).to.deep.equal(
			new Uint8Array([
				0,0,0,2, 0,0,0,1, 0,0,0,2,
				0,0,0,4, 0,0,0,3, 0,0,0,4, 0,0,0,5, 0,0,0,6,
			]));
	});

	it('writes 64-bit int arrays', function() {
		var writer = new nbt.Writer();
		writer.longArray([[15, 1]]);
		writer.longArray([[269488144, 538976288], [16909060, 84281096]]);

		expect(new Uint8Array(writer.getData())).to.deep.equal(
			new Uint8Array([
				0,0,0,1, 0,0,0,15, 0,0,0,1,
				0,0,0,2, 16,16,16,16, 32,32,32,32, 1,2,3,4, 5,6,7,8,
			]));
	});

	it('writes strings', function() {
		var writer = new nbt.Writer();
		writer.string('Hello!');
		writer.string('こんにちは!');

		expect(new Uint8Array(writer.getData())).to.deep.equal(
			new Uint8Array([
				0,6,  0x48,0x65,0x6C,0x6C,0x6F,0x21,
				0,16, 0xE3,0x81,0x93,0xE3,0x82,0x93,0xE3,0x81,
					  0xAB,0xE3,0x81,0xA1,0xE3,0x81,0xAF,0x21
			]));
	});

	it('writes lists', function() {
		var writer = new nbt.Writer();
		writer.list({ type: "byte", value: [1, 2, 3] });
		writer.list({ type: "string", value: ['Hello', 'World'] });

		expect(new Uint8Array(writer.getData())).to.deep.equal(
			new Uint8Array([
				1, 0,0,0,3, 1, 2, 3,
				8, 0,0,0,2, 0,5, 0x48,0x65,0x6C,0x6C,0x6F,
				            0,5, 0x57,0x6F,0x72,0x6C,0x64
			]));
	});

	it('writes compounds', function() {
		var writer = new nbt.Writer();

		writer.compound({
			aa: { type: "byte", value: 1 },
			bb: { type: "list", value: { type: "byte", value: [1, 2, 3] } }
		});

		writer.compound({
			cc: { type: "byte", value: 2 }
		});

		expect(new Uint8Array(writer.getData())).to.deep.equal(
			new Uint8Array([
				1, 0,2, 0x61,0x61, 1,
				9, 0,2, 0x62,0x62, 1, 0,0,0,3, 1, 2, 3,
				0,
				1, 0,2, 0x63,0x63, 2,
				0
			]));
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

		expect(new Uint8Array(writer.getData())).to.deep.equal(
			new Uint8Array([
				0x12, 0x56, 0x78
			]));
	});

	it('can seek to a location beyond the buffer', function() {
		var writer = new nbt.Writer();
		writer.short(0x1234);
		writer.offset = 1024;
		writer.short(0x5678);

		var data = writer.getData();
		var array = new Uint8Array(data);
		expect(array.length).to.equal(1026);
		expect(array[0]).to.equal(0x12);
		expect(array[1]).to.equal(0x34);
		expect(array[2]).to.equal(0);
		expect(array[1023]).to.equal(0);
		expect(array[1024]).to.equal(0x56);
		expect(array[1025]).to.equal(0x78);
	});
});

