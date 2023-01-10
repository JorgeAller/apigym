const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const selectUserByUsernameQuery = async (username) => {
  let connection;

  try {
    connection = await getConnection();

    const [users] = await connection.query(
      `SELECT id, username, avatar, email, password, role, createdAt FROM users WHERE username = ?`,
      [username]
    );

    if (users.length < 1) {
      throw generateError("Username incorrecto", 404);
    }

    return users[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectUserByUsernameQuery;
