const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const insertLikeQuery = async (idUser, idExercise) => {
  let connection;

  try {
    connection = await getConnection();

    // Comprobamos si el usuario ya ha dado like al ejercicio
    const [likes] = await connection.query(
      `SELECT id FROM likesexercises WHERE idUser = ? AND idExercise = ?`,
      [idUser, idExercise]
    );

    if (likes.length > 0) {
      throw generateError(
        "No puedes dar like dos veces al mismo ejercicio",
        403
      );
    }

    await connection.query(
      `
                INSERT INTO likesexercises (idUser, idExercise, createdAt) 
                VALUES (?, ?, ?)
            `,
      [idUser, idExercise, new Date()]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertLikeQuery;
