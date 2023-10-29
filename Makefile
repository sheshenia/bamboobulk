build:
	rm -f extension/content.js
	cd react-app && npm run build
	cd ..
	mv react-app/dist/assets/index*js extension/content.js

install:
	cd react-app && npm install
