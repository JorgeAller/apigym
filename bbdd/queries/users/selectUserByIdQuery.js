const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const selectUserByIdQuery = async (idUser) => {
  let connection;

  try {
    connection = await getConnection();

    const [users] = await connection.query(
      `
        SELECT 
          U.id, 
          U.username, 
          U.password,
          U.email, 
          U.avatar, 
          U.role, 
          COUNT(E.id) AS exercises, 
          U.createdAt 
        FROM users U
       LEFT JOIN Exercises E ON U.id = E.idUser
        WHERE U.id = ?
        GROUP BY U.id`,
      [idUser]
    );

    if (users.length < 1) {
      throw generateError("Usuario no encontrado", 404);
    }

    return users[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectUserByIdQuery;
