build:
	rm -rf extension/assets
	cd react-app && npm run build
	cd ..
	mv react-app/dist/* extension

install:
	cd react-app && npm install