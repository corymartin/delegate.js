
build: clean compile

clean:
	@@rm -f build/delegate.min.js

compile:
	@@cp lib/delegate.js build/delegate.js
	@@./node_modules/uglify-js/bin/uglifyjs --comments --unsafe --output build/delegate.min.js build/delegate.js

