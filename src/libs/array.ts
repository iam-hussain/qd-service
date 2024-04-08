import _ from 'lodash';

// Merge arrays within grouped objects by concatenating them
const mergeArrays = (objValue: string | any[], srcValue: any) => {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
};

export default {
  mergeArrays,
};
