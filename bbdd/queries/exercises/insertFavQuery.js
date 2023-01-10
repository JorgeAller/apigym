const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const insertFavQuery = async (idUser, idExercise, idRutine) => {
  let connection;

  try {
    connection = await getConnection();

    // Comprobamos si el usuario ya ha dado like al ejercicio
    const [favs] = await connection.query(
      `SELECT id FROM favsrutines WHERE idUser = ? AND idExercise = ? AND idRutine = ?`,
      [idUser, idExercise, idRutine]
    );

    // Si quisiéramos prohibir añadir dos veces el mismo ejercicio a una rutina.
    /* if (favs.length > 0) {
      throw generateError(
        "No puedes dar like dos veces al mismo ejercicio",
        403
      );
    } */

    await connection.query(
      `
                INSERT INTO favsrutines (idUser, idExercise, idRutine, createdAt) 
                VALUES (?, ?, ?, ?)
            `,
      [idUser, idExercise, idRutine, new Date()]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertFavQuery;
