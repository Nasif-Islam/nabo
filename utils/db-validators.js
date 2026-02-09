const db = require("../db/connection");
const format = require("pg-format");

exports.validateId = (id) => {
  if (isNaN(id) || id <= 0) {
    throw { status: 400, msg: "Bad request" };
  }
};

exports.checkExists = async (table, column, value) => {
  const queryStr = format(
    "SELECT * FROM %I WHERE %I = %L;",
    table,
    column,
    value,
  );

  const { rows } = await db.query(queryStr);

  if (rows.length === 0) {
    const resource = table.charAt(0).toUpperCase() + table.slice(1, -1);
    throw { status: 404, msg: `${resource} not found` };
  }
};
