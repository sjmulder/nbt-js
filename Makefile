NODE      = node
PHANTOMJS = phantomjs
PHANTOMJS_RUNNER = node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js
JSLINT    = node_modules/.bin/jshint
JSTEST    = node_modules/.bin/mocha
JSDOC     = node_modules/.bin/jsdoc
ECLINT    = node_modules/.bin/eclint check

TEST_SRC = test/*-spec.js

.PHONY: check doc watch

all:
	@echo "Run 'make check' to lint and run tests."

check:
	$(ECLINT) *
	$(JSLINT) nbt.js test/*.js sample/sample.js
	cd sample && $(NODE) sample.js > /dev/null
	$(JSTEST) $(TEST_SRC)
	$(PHANTOMJS) $(PHANTOMJS_RUNNER) test/test.html

doc:
	rm -rf docs/
	$(JSDOC) -d docs/ Readme.md nbt.js

watch:
	while true; do clear; $(MAKE) check; sleep 4; done
