const getConnection = require("../../getConnection");

const updateUserQuery = async (email, avatar, idUser) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `UPDATE users SET email = ?, avatar = ?, modifiedAt = ? WHERE id = ?`,
      [email, avatar, new Date(), idUser]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateUserQuery;
