const getConnection = require("../../getConnection");
const selectUserByIdQuery = require("./selectUserByIdQuery");

const updateUserQuery = async (email, avatar, role, idUser) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `UPDATE users SET email = ?, avatar = ?, role = ?, modified = 1, modifiedAt = ? WHERE id = ?`,
      [email, avatar, role, new Date(), idUser]
    );

    const user = selectUserByIdQuery(idUser);

    return user;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateUserQuery;
