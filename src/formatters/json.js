import _ from 'lodash';

const makeJson = (data) => {
    const clone = _.cloneDeep(data)
    return JSON.stringify(clone)
}

export default makeJson