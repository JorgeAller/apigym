const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const deleteLikeQuery = async (idUser, idRutine) => {
  let connection;

  try {
    connection = await getConnection();

    // Comprobamos que el usuario haya dado like al ejercicio.
    const [likes] = await connection.query(
      `SELECT id FROM likesRutines WHERE idUser = ? AND idRutine = ?`,
      [idUser, idRutine]
    );
    if (likes.length === 0) {
      throw generateError("Like no encontrado", 404);
    }

    await connection.query(
      `DELETE FROM likesRutines WHERE idUser = ? AND idRutine = ?`,
      [idUser, idRutine]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteLikeQuery;
