(function() {
	'use strict';

	/* Polyfills of a handful of interfaces to run the unit tests almost
	   unmodified in the browser. */

	function decodeUTF8(array) {
		var codepoints = [], i;
		for (i = 0; i < array.length; i++) {
			if ((array[i] & 0x80) === 0) {
				codepoints.push(array[i] & 0x7F);
			} else if (i+1 < array.length &&
						(array[i]   & 0xE0) === 0xC0 &&
						(array[i+1] & 0xC0) === 0x80) {
				codepoints.push(
					((array[i]   & 0x1F) << 6) |
					( array[i+1] & 0x3F));
			} else if (i+2 < array.length &&
						(array[i]   & 0xF0) === 0xE0 &&
						(array[i+1] & 0xC0) === 0x80 &&
						(array[i+2] & 0xC0) === 0x80) {
				codepoints.push(
					((array[i]   & 0x0F) << 12) |
					((array[i+1] & 0x3F) <<  6) |
					( array[i+2] & 0x3F));
			} else if (i+3 < array.length &&
						(array[i]   & 0xF8) === 0xF0 &&
						(array[i+1] & 0xC0) === 0x80 &&
						(array[i+2] & 0xC0) === 0x80 &&
						(array[i+3] & 0xC0) === 0x80) {
				codepoints.push(
					((array[i]   & 0x07) << 18) |
					((array[i+1] & 0x3F) << 12) |
					((array[i+2] & 0x3F) <<  6) |
					( array[i+3] & 0x3F));
			}
		}
		return String.fromCharCode.apply(null, codepoints);
	}

	/* Simply returns window[<module>] */
	window.require = function(module) {
		return window[module];
	};

	/* Returns window[<filename>], converted to UTF8 if the 'utf8' encoding
	   is requested.

	   Use jsinc to convert files to a .js file that can be included with
	   a script file and used here:

	       jsinc myfile.dat > myfile.dat.js

		   <script src="myfile.dat.js"></script>
		   <script>
		       // window['myfile.dat'] is an ArrayBuffer
		   </script>
	*/
	window.fs = {};
	window.fs.readFileSync = function(filename, encoding) {
		var data = window[filename];
		if (!data) {
			throw new Error('Unregistered file for readFileSync polyfill: ' +
				filename);
		} else if (encoding === 'utf8') {
			return decodeUTF8(new Uint8Array(data));
		} else {
			return data;
		}
	};

	/* ArrayBuffer.prototype.slice() is missing in PhantomJS < 2.0 but
	   required for the jsinc files. */
	if (!('slice' in ArrayBuffer.prototype)) {
		ArrayBuffer.prototype.slice = function(begin, end) {
			if (!end) { end = this.byteLength; }
			if (begin > end) { return new ArrayBuffer(0); }
			var ret = new ArrayBuffer(end - begin);
			new Uint8Array(ret).set(new Uint8Array(this, begin, end - begin));
			return ret;
		};
	}
})();
