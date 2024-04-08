import _ from 'lodash';

// Merge arrays within grouped objects by concatenating them
export const mergeArrays = (objValue: string | any[], srcValue: any) => {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
};
