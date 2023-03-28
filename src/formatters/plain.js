import _ from 'lodash';

const outputValue = (value) => {
    if (_.isPlainObject(value)) {
        return '[complex value]';
    }
    return typeof value === 'string' ? `'${value}'` : value;
  };

const makePlain = (data) => {
    const clone = _.cloneDeep(data)

    const iter = (curValue, keys) => {
        const resLines = curValue.filter(({ status }) => status !== "no changed").map((item) => {
            const arrOfKeys = [...keys, item.key];
            const prop = arrOfKeys.join('.');
            
            switch (item.status) {
                case 'deleted':
                    return `Property ${prop} was removed`
                
                case 'new':
                    return `Property ${prop} was added with value: ${outputValue(item.value)}`
                
                case 'nested':
                    return iter(item.children, arrOfKeys)
                
                case 'changed':
                    return `Property ${prop} was updated. From ${outputValue(item.oldValue)} to ${outputValue(item.newValue)}`
                
                default:
                    throw new Error("Unknown status")
            }
        })

        return resLines.join("\n")
    }

    return iter(clone, [])
}

export default makePlain