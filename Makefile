build:
	rm -rf extension/assets
	cd popup-react-app && npm run build
	cd ..
	mv popup-react-app/dist/* extension
	cd content-app && npm run build
	cd ..
	mv content-app/dist/assets/index*.css extension/content-style.css
	mv content-app/dist/assets/index*.js extension/content.js

install:
	cd react-app && npm install
	cd ..
	cd content-app && npm install