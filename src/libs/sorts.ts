const zeroLastSortPosition = (a: { position: number } & any, b: { position: number } & any) => {
  if (a.position === 0) {
    return 1;
  } else if (b.position === 0) {
    return -1;
  } else {
    return a.position - b.position;
  }
};

export default {
  zeroLastSortPosition,
};
