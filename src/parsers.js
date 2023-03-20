import yaml from 'js-yaml'

const parse = (beginData, parseExt) => {
    switch (parseExt) {

      case 'yaml':
      case 'yml':
        return yaml.load(beginData);
        
      case 'json':
        return JSON.parse(beginData);

      default:
        throw new Error(`Unknown extension: ${parseExt}`);
    }
};

export default parse