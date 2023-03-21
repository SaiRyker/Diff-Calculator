import * as fs from 'fs';
import _ from 'lodash';
import {resolve, extname} from 'node:path';
import parse from '../src/parsers.js' 

const getExtension = (filePath) => extname(filePath).slice(1);

const getParsedData = (filePath) => parse(fs.readFileSync(resolve('__fixtures__', filePath)), getExtension(filePath))

const makePlainStatus = (arr, file1Data, file2Data) => {

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

const makeStatus = (arr, file1Data, file2Data) => {
    const iter = (arr, file1Data, file2Data) => {

    const temp = arr.map((keyName) => {
        if (_.has(file1Data, keyName) && _.has(file2Data, keyName)) {
            if (_.isObject(file1Data[`${keyName}`])) {
                const newKeys = _.sortBy(_.union(_.keys(file1Data[`${keyName}`]), _.keys(file2Data[`${keyName}`])))
                return iter(newKeys, file1Data[`${keyName}`], file2Data[`${keyName}`])
            } else {
                if (_.get(file1Data, keyName) === _.get(file2Data, keyName)) {
                    return {keyName, 'status': "no change", "value": _.get(file1Data, keyName)}
                } else {
                    return {keyName, 'status': "changed", "value1": _.get(file1Data, keyName), "value2": _.get(file2Data, keyName)}
                }
            }
        } else if (!_.has(file1Data, keyName) && _.has(file2Data, keyName)) {
            return {keyName, 'status': "new", "value": _.get(file2Data, keyName)}    
        } else if (_.has(file1Data, keyName) && !_.has(file2Data, keyName)) {
            return {keyName, 'status': "deleted", "value": _.get(file1Data, keyName)}
        }
    })
    return temp
    }
    const newtemp = iter(arr, file1Data, file2Data)
    const plainTemp = makePlainStatus(arr, file1Data, file2Data)
    const result = []

    for (let i = 0; i < arr.length; i++) {

        result[i] = [plainTemp[i], newtemp[i]]
    }

    return result
}



const makeResult = (arr) => {
    let result = "{\n";
    
    for (const item of arr) {
        if (_.isArray(item)) {
            console.log(item)
            makeResult(item)
        } else if (_.isObject(item)) {
            console.log(item)
            
        }

        if (_.get(item, "status") === "no change") {
             result += `${item.keyName}:${_.get(item, "value")},\n`
         } else if (_.get(item, "status") === "changed") {
             result += `-${item.keyName}:${_.get(item, "value1")},\n+${item.keyName}:${_.get(item, "value2")},\n`
         } else if (_.get(item, "status") === "new") {
             result += `+${item.keyName}:${_.get(item, "value")},\n`
         } else if (_.get(item, "status") === "deleted") {
             result += `-${item.keyName}:${_.get(item, "value")},\n`
         }

    }



    return result + '}'


    // const cloneDeepObj = _.cloneDeep(obj)
    // for (const i of cloneDeepObj) {
    //     if (_.get(i, "status") === "no change") {
    //         result += `${i.keyName}:${_.get(i, "value")},\n`
    //     } else if (_.get(i, "status") === "changed") {
    //         result += `-${i.keyName}:${_.get(i, "value1")},\n+${i.keyName}:${_.get(i, "value2")},\n`
    //     } else if (_.get(i, "status") === "new") {
    //         result += `+${i.keyName}:${_.get(i, "value")},\n`
    //     } else if (_.get(i, "status") === "deleted") {
    //         result += `-${i.keyName}:${_.get(i, "value")},\n`
    //     }
    // }
}

const genDiff = (file1, file2) => {
    const file1Data = getParsedData(file1)
    const file2Data = getParsedData(file2)
    //return _.isObject(file1Data.common)
    const keys = _.sortBy(_.union(_.keys(file1Data), _.keys(file2Data)))

    const temp = makeStatus(keys, file1Data, file2Data)

    //5const result = makeResult(temp)

    return temp
}

console.log(genDiff("file1.json", "file2.json"))

export default genDiff