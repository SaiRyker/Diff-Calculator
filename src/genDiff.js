import * as fs from 'fs';
import {resolve, extname} from 'node:path';
import parse from '../src/parsers.js' 
import makeStylish from './formatters/stylish.js';
import makeStatus from './makeStatus.js';

const getExtension = (filePath) => extname(filePath).slice(1);

const getParsedData = (filePath) => parse(fs.readFileSync(resolve('__fixtures__', filePath)), getExtension(filePath))

const genDiff = (file1, file2) => {
    const file1Data = getParsedData(file1)
    const file2Data = getParsedData(file2)

    const temp = makeStatus(file1Data, file2Data)

    const result = makeStylish(temp)

    return result
}

console.log(genDiff("file1.json", "file2.json"))

export default genDiff