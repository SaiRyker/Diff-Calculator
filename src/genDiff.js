import * as fs from 'fs';
import _ from 'lodash';
import {cwd} from 'node:process';
import {resolve} from 'node:path';


const parse = (data) => JSON.parse(data);



const genDiff = (file1, file2) => {
    const file1Data = parse(fs.readFileSync(resolve(cwd(), file1)))
    const file2Data = parse(fs.readFileSync(resolve(cwd(), file2)))

    let result = "{\n";
    const keys = _.sortBy(_.union(_.keys(file1Data), _.keys(file2Data)))

    const temp = keys.map((keyName) => {
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

    for (const i of temp) {
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

export default genDiff