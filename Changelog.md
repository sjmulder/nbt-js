Changelog
=========

0.4.0
-----

 * Feature: the `Reader` constructor is now public and can be used to read individual NBT elements from a buffer.
 * Feature: support for `npm test` using the previously built testing infrastructure.
 * Improvement: greatly expanded test coverage.
 * Improvement: byte array values are now returned as arrays rather than Buffer objects.
 * Improvement: continuous integration with Travis now runs test against the GitHub repository.
 * Improvement: added a changelog.
 * Fix: the long reader returned incorrect values due to an operator precedence issue.

0.3.0
-----

 * Improvement: jshint Grunt task for checking code quality.
 * Improvement: small fixes throughout based on jshint tips.
 * Improvement: added various unit tests with Jasmine.
 * Improvemnet: added links in documentation for easy lookup.
 * Improvement: dropped bundled binary library for built-in `Buffer`.

0.2.0
-----

 * Feature: support for gzipped archives.
 * Feature: support for int arrays (type 11).
 * Improvement: when the root node is a compound with no name, only the value is returned.
 * Improvement: better documentation.
 * Improvement: when an error occurs, an Error is thrown rather than as string.

0.1.0
-----

Initial release.
