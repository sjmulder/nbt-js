JSLINT = node_modules/.bin/jshint
JSTEST = node_modules/.bin/mocha
JSDOC  = node_modules/.bin/jsdoc

.PHONY: check doc watch clean

all:
	@echo "Run 'make check' to lint and run tests."

check:
	$(JSLINT) nbt.js test/*.js sample/sample.js
	$(JSTEST) test/*.js

doc:
	$(JSDOC) -d doc/ Readme.md nbt.js

watch:
	while true; do clear; $(MAKE) check doc; sleep 4; done

clean:
	rm -rf doc/
