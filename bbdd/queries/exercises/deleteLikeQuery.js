// UTILIZAMOS QUERY DE DAR LIKE PARA ELIMINAR EL LIKE SI ES EXISTENTE

const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const deleteLikeQuery = async (idUser, idExercise) => {
  let connection;

  try {
    connection = await getConnection();

    // Comprobamos que el usuario haya dado like al ejercicio.
    const [likes] = await connection.query(
      `SELECT id FROM likesExercises WHERE idUser = ? AND idExercise = ?`,
      [idUser, idExercise]
    );
    if (likes.length === 0) {
      throw generateError("Like no encontrado", 404);
    }

    await connection.query(
      `DELETE FROM likesExercises WHERE idUser = ? AND idExercise = ?`,
      [idUser, idExercise]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteLikeQuery;
