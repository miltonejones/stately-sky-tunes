export const getPagination = (
  collection,
  { page = 1, count, pageSize, sortkey }
) => {
  const collectionLength = count || collection?.length;
  const pageCount = Math.ceil(collectionLength / pageSize);
  const startNum = (page - 1) * pageSize;

  const sorted = !sortkey
    ? collection
    : collection?.sort((a, b) => (a[sortkey] > b[sortkey] ? 1 : -1));

  const visible = sorted?.slice(startNum, startNum + pageSize);

  return {
    startNum,
    endNum: startNum + pageSize,
    pageCount,
    visible,
  };
};
