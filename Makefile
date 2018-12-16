NODE      = node
JSTEST    = node_modules/.bin/mocha
JSDOC     = node_modules/.bin/jsdoc

.PHONY: check doc watch

all:
	@echo "Run 'make check' to lint and run tests."

check:
	cd sample && $(NODE) sample.js > /dev/null
	$(JSTEST) test/*-spec.js

doc:
	rm -rf docs/
	$(JSDOC) -d docs/ Readme.md nbt.js

watch:
	while true; do clear; $(MAKE) check; sleep 4; done
