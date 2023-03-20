import * as fs from 'fs';
import _ from 'lodash';
import {resolve, extname} from 'node:path';
import parse from '../src/parsers.js' 

const getExtension = (filePath) => extname(filePath).slice(1);

const getParsedData = (filePath) => parse(fs.readFileSync(resolve('__fixtures__', filePath)), getExtension(filePath))


const makeStatus = (arr, file1Data, file2Data) => {
    const temp = arr.map((keyName) => {
        if (_.has(file1Data, keyName) && _.has(file2Data, keyName)) {
            if (_.get(file1Data, keyName) === _.get(file2Data, keyName)) {
                return {keyName, 'status': "no change", "value": _.get(file1Data, keyName)}
            } else {
                return {keyName, 'status': "changed", "value1": _.get(file1Data, keyName), "value2": _.get(file2Data, keyName)}
            }
        } else if (!_.has(file1Data, keyName) && _.has(file2Data, keyName)) {
            return {keyName, 'status': "new", "value": _.get(file2Data, keyName)}
        } else if (_.has(file1Data, keyName) && !_.has(file2Data, keyName)) {
            return {keyName, 'status': "deleted", "value": _.get(file1Data, keyName)}
        }
    })
    return temp
}

const makeResult = (obj) => {
    let result = "{\n";
    const cloneDeepObj = _.cloneDeep(obj)
    for (const i of cloneDeepObj) {
        if (_.get(i, "status") === "no change") {
            result += `${i.keyName}:${_.get(i, "value")},\n`
        } else if (_.get(i, "status") === "changed") {
            result += `-${i.keyName}:${_.get(i, "value1")},\n+${i.keyName}:${_.get(i, "value2")},\n`
        } else if (_.get(i, "status") === "new") {
            result += `+${i.keyName}:${_.get(i, "value")},\n`
        } else if (_.get(i, "status") === "deleted") {
            result += `-${i.keyName}:${_.get(i, "value")},\n`
        }
    }
    return result + '}'
}

const genDiff = (file1, file2) => {
    const file1Data = getParsedData(file1)
    const file2Data = getParsedData(file2)

    const keys = _.sortBy(_.union(_.keys(file1Data), _.keys(file2Data)))

    const temp = makeStatus(keys, file1Data, file2Data)

    const result = makeResult(temp)

    return result
}


export default genDiff