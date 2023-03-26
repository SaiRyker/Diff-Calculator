import _ from 'lodash'

const stringify = (val, depth) => {
    const spaceCounts = '  '.repeat(depth)
    if (!_.isObject(val)) {
      return val;
    }
  
    const lines = Object.entries(val).map(([key, value]) => {
      if (!_.isObject(value)) {
        return `${spaceCounts}${key}: ${value}`;
      }
  
      return `${spaceCounts}${key}: ${stringify(value, depth + 1)}`;
    });
  
    return ['{', ...lines, `${spaceCounts}}`].join('\n');
  };

const childrenMap = (children, depth) => {
    const spaceCounts = '  '.repeat(depth)
    const clone = _.cloneDeep(children)
    let temp = ""
    for (const child of clone) {
        if (_.isArray(child)) {
            return childrenMap(child, depth+1)
        }
        else if (child.status === "nested") {
            temp += `${spaceCounts}${child.key}: {\n`
            temp += childrenMap(child.children, depth+1)
            temp += `${spaceCounts}\n}\n`
        }
        else if (child.status === "no changed") {
           temp += `${spaceCounts}${child.key}:${stringify(_.get(child, "value"), depth+1)},\n`
       } else if (child.status === "changed") {
           temp += `${spaceCounts}-${child.key}:${stringify(_.get(child, "oldValue",), depth+1)},\n${spaceCounts}+${child.key}:${stringify(_.get(child, "newValue"), depth+1)},\n`
       } else if (child.status === "new") {
           temp += `${spaceCounts}+${child.key}:${stringify(_.get(child, "value"), depth+1)},\n`
       } else if (child.status === "deleted") {
           temp += `${spaceCounts}-${child.key}:${stringify(_.get(child, "value"), depth+1)},\n`
       }
   }
   return temp
}

const makeStylish = (array) => {
    let result = "{\n"
    const cloneInitial = _.cloneDeep(array)

    for (const item of cloneInitial) {
        if (item.status === "nested") {
            result += ` ${item.key}: {\n`
            result += childrenMap(item.children, 2)
        }
        else if (item.status === "deleted") {
            result += ` -${item.key}: `
            result += _.concat(stringify(item.value, 2), '\n') 
        }
        else if (_.get(item, "status") === "new") {
            result += ` +${item.key}: `
            result += stringify(item.value, 2)
        }
        
    }

    return result
}

export default makeStylish