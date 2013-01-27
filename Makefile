
build: clean compile

clean:
	@@rm -f dist/delegate.min.js

compile:
	@@cp lib/delegate.js dist/delegate.js
	@@./node_modules/uglify-js/bin/uglifyjs --comments --output dist/delegate.min.js dist/delegate.js

