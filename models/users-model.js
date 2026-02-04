const db = require("../db/connection");

async function getUsers() {
  const res = await db.query(`
        SELECT username FROM users;
        `);

  return res.rows;
}
