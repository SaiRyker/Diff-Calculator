import * as fs from 'fs';
import {resolve, extname} from 'node:path';
import parse from '../src/parsers.js' 
import makeStylish from './formatters/stylish.js';
import makeStatus from './makeStatus.js';
import makePlain from './formatters/plain.js';
import makeJson from './formatters/json.js';

const getExtension = (filePath) => extname(filePath).slice(1);

const getParsedData = (filePath) => parse(fs.readFileSync(resolve('__fixtures__', filePath)), getExtension(filePath))

const genDiff = (file1, file2, formatName = 'stylish') => {
    const file1Data = getParsedData(file1)
    const file2Data = getParsedData(file2)

    const temp = makeStatus(file1Data, file2Data)

    switch(formatName) {
        case 'stylish':
            return makeStylish(temp)
        
        case 'plain':
            return makePlain(temp)

        case 'json':
            return makeJson(temp)
    }
}

export default genDiff