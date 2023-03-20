test:
	echo "Hello World!"

gendiff:
	node bin/gendiff.js "file1.yml" "file2.yml"

lint: 
	npx eslint .

test:
	npm test