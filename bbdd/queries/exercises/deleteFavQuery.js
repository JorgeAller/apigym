const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const deleteFavQuery = async (idUser, idRutine, idExercise, idFav) => {
  let connection;

  try {
    connection = await getConnection();

    const [rutines] = await connection.query(
      `SELECT id FROM favsRutines WHERE idUser = ? AND idRutine = ? AND idExercise = ? AND id = ?`,
      [idUser, idRutine, idExercise, idFav]
    );
    if (rutines.length === 0) {
      throw generateError("No puedes eliminar este favorito", 401);
    }

    await connection.query(
      `DELETE FROM favsRutines WHERE idRutine = ? AND idExercise = ? AND id = ?`,
      [idRutine, idExercise, idFav]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteFavQuery;
