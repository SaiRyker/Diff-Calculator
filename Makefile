install:
	npm ci

test:
	echo "Hello World!"

gendiff:
	node bin/gendiff.js --format json "file1.json" "file2.json" 

lint: 
	npx eslint .

test:
	npm test