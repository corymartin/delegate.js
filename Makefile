NAME=$(shell node -e "console.log(require('./package.json').name)")
DESCRIPTION=$(shell node -e "console.log(require('./package.json').description)")
VERSION=$(shell node -e "console.log(require('./package.json').version)")
HOMEPAGE=$(shell node -e "console.log(require('./package.json').homepage)")

build: clean compile

clean:
	@@rm -f dist/*

compile:
	@@cat lib/delegate.js \
		| sed 's/{{VERSION}}/$(VERSION)/g' \
		| sed 's/{{NAME}}/$(NAME)/g' \
		| sed 's/{{DESCRIPTION}}/$(DESCRIPTION)/g' \
		| sed 's|{{HOMEPAGE}}|$(HOMEPAGE)|g' \
		> dist/delegate.js
	@@./node_modules/uglify-js/bin/uglifyjs \
		--mangle --comments --output \
		dist/delegate.min.js dist/delegate.js

