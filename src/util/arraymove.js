
  export const  arraymove = (arr, fromIndex, toIndex) => {
    if (toIndex > -1) {
      var element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
      return arr;
    } 
  }
