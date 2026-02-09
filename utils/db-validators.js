exports.validateId = (id) => {
  if (isNaN(id) || id <= 0) {
    throw { status: 400, msg: "Bad request" };
  }
};

exports.checkExists = (rows, resourceName) => {
  if (rows.length === 0) {
    throw { status: 404, msg: `${resourceName} not found` };
  }
};
