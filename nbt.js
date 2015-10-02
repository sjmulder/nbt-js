/*
	NBT.js - a JavaScript parser for NBT archives
	by Sijmen Mulder

	I, the copyright holder of this work, hereby release it into the public
	domain. This applies worldwide.

	In case this is not legally possible: I grant anyone the right to use this
	work for any purpose, without any conditions, unless such conditions are
	required by law.
*/

(function() {
	'use strict';

	var nbt = this;
	var zlib = require('zlib');

	nbt.tagTypes = {
		'end': 0,
		'byte': 1,
		'short': 2,
		'int': 3,
		'long': 4,
		'float': 5,
		'double': 6,
		'byteArray': 7,
		'string': 8,
		'list': 9,
		'compound': 10,
		'intArray': 11
	};

	nbt.tagTypeNames = {};
	(function() {
		for (var typeName in nbt.tagTypes) {
			if (nbt.tagTypes.hasOwnProperty(typeName)) {
				nbt.tagTypeNames[nbt.tagTypes[typeName]] = typeName;
			}
		}
	})();

	function hasGzipHeader(data) {
		return data[0] === 0x1f && data[1] === 0x8b;
	}

	nbt.Writer = function() {
		var self = this;

		this.buffer = new Buffer(0);
		this.offset = 0; // bufer is adjusted on write

		// Ensures that the buffer is large enough to write `size` bytes
		// at the current `self.offset`.
		function accommodate(size) {
			if (self.offset + size >= self.buffer.length) {
				var oldBuffer = self.buffer;
				self.buffer = new Buffer(self.offset + size);
				oldBuffer.copy(self.buffer);

				// If there's a gap between the end of the old buffer
				// and the start of the new one, we need to zero it out
				if (self.offset > oldBuffer.length) {
					self.buffer.fill(0, oldBuffer.length, self.offset);
				}
			}
		}

		function getStringSize(str) {
			// returns the byte length of an utf8 string
			var s = str.length;
			var i;

			for (i=str.length-1; i>=0; i--) {
				var code = str.charCodeAt(i);
				if (code > 0x7f && code <= 0x7ff) {
					s++;
				} else if (code > 0x7ff && code <= 0xffff) {
					s += 2;
					if (code >= 0xDC00 && code <= 0xDFFF) {
						// trail surrogate
						i--;
					}
				}
			}
			return s;
		}

		function write(dataType, size, value) {
			accommodate(size);
			self.buffer['write' + dataType](value, self.offset);
			self.offset += size;
			return self;
		}

		this[nbt.tagTypes.byte]   = write.bind(this, 'Int8', 1);
		this[nbt.tagTypes.short]  = write.bind(this, 'Int16BE', 2);
		this[nbt.tagTypes.int]    = write.bind(this, 'Int32BE', 4);
		this[nbt.tagTypes.float]  = write.bind(this, 'FloatBE', 4);
		this[nbt.tagTypes.double] = write.bind(this, 'DoubleBE', 8);

		this[nbt.tagTypes.long] = function(value) {
			self.int(value[0]);
			self.int(value[1]);
			return self;
		};

		this[nbt.tagTypes.byteArray] = function(value) {
			this.int(value.length);
			accommodate(value.length);
			var valueBuffer = 'copy' in value ? value : new Buffer(value);
			valueBuffer.copy(this.buffer, this.offset);
			this.offset += value.length;
			return this;
		};

		this[nbt.tagTypes.intArray] = function(value) {
			this.int(value.length);
			var i;
			for (i = 0; i < value.length; i++) {
				this.int(value[i]);
			}
			return this;
		};

		this[nbt.tagTypes.string] = function(value) {
			var len = getStringSize(value);
			this.short(len);
			accommodate(len);
			this.buffer.write(value, this.offset);
			this.offset += len;

			return this;
		};

		this[nbt.tagTypes.list] = function(value) {
			this.byte(nbt.tagTypes[value.type]);
			this.int(value.value.length);
			var i;
			for (i = 0; i < value.value.length; i++) {
				this[value.type](value.value[i]);
			}
			return this;
		};

		this[nbt.tagTypes.compound] = function(value) {
			var self = this;
			Object.keys(value).map(function (key) {
				self.byte(nbt.tagTypes[value[key].type]);
				self.string(key);
				self[value[key].type](value[key].value);
			});
			this.byte(nbt.tagTypes.end);
			return this;
		};

		var typeName;
		for (typeName in nbt.tagTypes) {
			if (nbt.tagTypes.hasOwnProperty(typeName)) {
				this[typeName] = this[nbt.tagTypes[typeName]];
			}
		}

	};

	nbt.Reader = function(buffer) {
		var self = this;

		this.offset = 0;

		function read(dataType, size) {
			var val = buffer['read' + dataType](self.offset);
			self.offset += size;
			return val;
		}

		this[nbt.tagTypes.byte]   = read.bind(this, 'Int8', 1);
		this[nbt.tagTypes.short]  = read.bind(this, 'Int16BE', 2);
		this[nbt.tagTypes.int]    = read.bind(this, 'Int32BE', 4);
		this[nbt.tagTypes.float]  = read.bind(this, 'FloatBE', 4);
		this[nbt.tagTypes.double] = read.bind(this, 'DoubleBE', 8);

		this[nbt.tagTypes.long] = function() {
			return [this.int(), this.int()];
		};

		this[nbt.tagTypes.byteArray] = function() {
			var length = this.int();
			var bytes = [];
			var i;
			for (i = 0; i < length; i++) {
				bytes.push(this.byte());
			}
			return bytes;
		};

		this[nbt.tagTypes.intArray] = function() {
			var length = this.int();
			var ints = [];
			var i;
			for (i = 0; i < length; i++) {
				ints.push(this.int());
			}
			return ints;
		};

		this[nbt.tagTypes.string] = function() {
			var length = this.short();
			var val = buffer.toString('utf8', this.offset, this.offset + length);
			this.offset += length;
			return val;
		};

		this[nbt.tagTypes.list] = function() {
			var type = this.byte();
			var length = this.int();
			var values = [];
			var i;
			for (i = 0; i < length; i++) {
				values.push(this[type]());
			}
			return { type: nbt.tagTypeNames[type], value: values };
		};

		this[nbt.tagTypes.compound] = function() {
			var values = {};
			while (true) {
				var type = this.byte();
				if (type === nbt.tagTypes.end) {
					break;
				}
				var name = this.string();
				var value = this[type]();
				values[name] = { type: nbt.tagTypeNames[type], value: value };
			}
			return values;
		};

		var typeName;
		for (typeName in nbt.tagTypes) {
			if (nbt.tagTypes.hasOwnProperty(typeName)) {
				this[typeName] = this[nbt.tagTypes[typeName]];
			}
		}
	};

	this.writeUncompressed = function(value) {
		var writer = new nbt.Writer();

		writer.byte(nbt.tagTypes.compound);
		writer.string(value.name);
		writer.compound(value.value);

		return writer.buffer;
	};

	this.parseUncompressed = function(data) {
		var buffer = new Buffer(data);
		var reader = new nbt.Reader(buffer);

		var type = reader.byte();
		if (type !== nbt.tagTypes.compound) {
			throw new Error('Top tag should be a compound');
		}

		return {
			name: reader.string(),
			value: reader.compound()
		};
	};

	this.parse = function(data, callback) {
		var self = this;

		if (hasGzipHeader(data)) {
			zlib.gunzip(data, function(error, uncompressed) {
				if (error) {
					callback(error, data);
				} else {
					callback(null, self.parseUncompressed(uncompressed));
				}
			});
		} else {
			callback(null, self.parseUncompressed(data));
		}
	};
}).apply(exports || (window.nbt = {}));
