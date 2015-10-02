'use strict';

module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-clean');

	var pkg = grunt.file.readJSON('package.json');

	grunt.initConfig({
		pkg: pkg,

		jshint: {
			options: {
				globals: {
					window: true
				},

				camelcase: true,
				curly: true,
				eqeqeq: true,
				forin: true,
				latedef: true,
				noarg: true,
				nonbsp: true,
				nonew: true,
				smarttabs: true,
				strict: true,
				sub: true,
				trailing: true,
				unused: true,
				undef: true,
				/* varstmt: true, */

				esnext: true,
				node: true,
				mocha: true
			},
			files: [
				'nbt.js',
				'test/*.js',
				'sample/sample.js',
				'Gruntfile.js'
			]
		},
		watch: {
			options: { atBegin: true },
			files: [
				'nbt.js',
				'nbt-spec.js',
				'sample/sample.js',
				'Gruntfile.js',
				'package.json'
			],
			tasks: ['jshint', 'mochaTest']
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					captureFile: 'results.txt',
					quiet: false,
					clearRequireCache: false
				},
				src: ['test/**/*.js']
			}
		},
		jsdoc: {
			dist: {
				src: [
					'Readme.md',
					'nbt.js'
				],
				dest: 'doc/'
			}
		},
		clean: ['doc/']
	});

	grunt.registerTask('test', 'mochaTest');
	grunt.registerTask('docs', ['clean', 'jsdoc']);

	grunt.registerTask('default', ['jshint', 'test', 'docs']);
};
