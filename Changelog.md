Changelog
=========

0.8.1 (2018-12-16)
-----------------

 * Fixed version in package.json

0.8.0 (2018-12-16)
------------------

 * New: longArray data type (thanks sourcehunter).
 * Change: dropped linting tools and PhantomJS tests.

0.7.0
-----

 * Feature: browser support, simply include nbt.js as-is.
 * Feature: new Reader/Writer.ubyte() for unsigned bytes.
 * Improvement: JSDoc documentation added.
 * Improvement: updated dependencies and upgraded to Node 6.
 * Improvement: simplified build by using make instead of grunt.
 * Improvement: added .editorconfig.
 * Improvement: automated code style checking with eclint.
 * Improvement: automatic NPM deployments with Travis CI.

0.6.0
-----

The big change here is that `parse()` now returns a consistent format again:

    parse(foo); // -> { name: 'Level', value: { ... } }

Similarly, that's what `writeUncompressed()` as well now:

    writeUncompressed({ name: 'Level', value: { ... } });

 * Improvement: dropped unused jasmine package dependency.
 * Improvement: [#13] read() and write() cycles are now guaranteed to be
   idempotent.
 * Improvement: [#14] back to consistent structure for parse() result.
 * Improvement: [#15] `writer.byteArray()` now accepts both arrays and
   `Buffer`s.
 * Fix: parse() would always throw when used on non-gzipped data.

0.5.0
-----

A merge and slight rework of the terrific improvements by the people at
[ProsmarineJS](https://github.com/PrismarineJS/prismarine-nbt).

 * Feature: support for writing archives (to a `Buffer`).
 * Improvement: switch to Mocha testing framwork.
 * Improvement: `Reader.offset` is now exposed.
 * Improvement: 64 bit values now represented as [upper, lower] pairs for
   better portability.
 * Improvement: exposed `nbt.writeUncompressed`, which is sync as opposed
   to its unzipping counterpart.
 * Improvement: lists and compounds now return type information. This creates
   a symetry because this output can be fed into the writer as-is.

0.4.0
-----

 * Feature: the `Reader` constructor is now public and can be used eo read
   individual NBT elements from a buffer.
 * Feature: support for `npm test` using the previously built testing
   infrastructure.
 * Improvement: greatly expanded test coverage.
 * Improvement: byte array values are now returned as arrays rather than
   Buffer objects.
 * Improvement: continuous integration with Travis now runs test against the
   GitHub repository.
 * Improvement: added a changelog.
 * Fix: the long reader returned incorrect values due to an operator
   precedence issue.

0.3.0
-----

 * Improvement: jshint Grunt task for checking code quality.
 * Improvement: small fixes throughout based on jshint tips.
 * Improvement: added various unit tests with Jasmine.
 * Improvement: added links in documentation for easy lookup.
 * Improvement: dropped bundled binary library for built-in `Buffer`.

0.2.0
-----

 * Feature: support for gzipped archives.
 * Feature: support for int arrays (type 11).
 * Improvement: when the root node is a compound with no name, only the value
   is returned.
 * Improvement: better documentation.
 * Improvement: when an error occurs, an Error is thrown rather than as
   string.

0.1.0
-----

Initial release.
