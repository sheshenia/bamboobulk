build:
	rm -f extension/content.js
	cd react-app && npm run build
	cd ..
	mv react-app/build/static/js/main*js extension/content.js

install:
	cd react-chrome-app && npm install
