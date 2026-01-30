// exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
//   if (!created_at) return { ...otherProperties };

//   return { ...otherProperties, created_at: new Date(created_at) };
// };

exports.createLookup = (arr, key, value) => {
  return arr.reduce((lookupObj, item) => {
    lookupObj[item[key]] = item[value];

    return lookupObj;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments
    .map((comment) => {
      const { article_title, ...restOfComment } = comment;

      const article_id = idLookup[article_title];

      if (article_id === undefined) {
        return null;
      }

      return {
        article_id,
        ...restOfComment,
      };
    })
    .filter((comment) => comment !== null);
};
