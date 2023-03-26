import _ from 'lodash'

const makeStatus = (file1Data, file2Data) => {
    const keys = _.sortBy(_.union(_.keys(file1Data), _.keys(file2Data)))

    return keys.map((key) => {
        if (_.isPlainObject(file1Data[key]) && _.isPlainObject(file2Data[key])) {
          return { key, status: 'nested', children: makeStatus(file1Data[key], file2Data[key]) };
        }
    
        if (!_.has(file2Data, key)) {
          return { key, status: 'deleted', value: file1Data[key] };
        }
    
        if (!_.has(file1Data, key)) {
          return { key, status: 'new', value: file2Data[key] };
        }
    
        if (_.isEqual(file1Data[key], file2Data[key])) {
          return { key, status: 'no changed', value: file1Data[key] };
        }
        return {
          key,
          status: 'changed',
          oldValue: file1Data[key],
          newValue: file2Data[key],
        };
      });
    };

export default makeStatus