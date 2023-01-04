const getConnection = require("../../getConnection");

const bcrypt = require("bcrypt");

const { generateError } = require("../../../helpers");

const insertUserQuery = async (username, email, password, role) => {
  let connection;

  try {
    connection = await getConnection();

    const [users] = await connection.query(
      `SELECT id FROM users WHERE username = ? OR email = ?`,
      [username, email]
    );

    if (users.length > 0) {
      throw generateError(
        "Ya existe un usuario con ese Username o ese email",
        403
      );
    }

    const hashPass = await bcrypt.hash(password, 10);

    await connection.query(
      `INSERT INTO users (username, email, password, role, createdAt)
            VALUES (?, ?, ?, ?, ?)`,
      [username, email, hashPass, role, new Date()]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertUserQuery;
