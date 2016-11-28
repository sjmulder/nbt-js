NODE   = node
JSLINT = node_modules/.bin/jshint
JSTEST = node_modules/.bin/mocha
JSDOC  = node_modules/.bin/jsdoc

TEST_SRC = test/*.js

.PHONY: check doc watch clean

all:
	@echo "Run 'make check' to lint and run tests."

check:
	$(JSLINT) nbt.js test/*.js sample/sample.js
	cd sample && $(NODE) sample.js > /dev/null
	$(JSTEST) $(TEST_SRC)

doc:
	$(JSDOC) -d doc/ Readme.md nbt.js

watch:
	while true; do clear; $(MAKE) check; sleep 4; done

clean:
	rm -rf doc/
