const getConnection = require("../../getConnection");
const { generateError } = require("../../../helpers");

const selectExerciseByIdQuery = async (idUser, idExercise) => {
  let connection;

  try {
    connection = await getConnection();

    // consulta para obtener el ejercicio
    const [exercises] = await connection.query(
      `
        SELECT 
          E.id,
          E.name, 
          E.description, 
          E.muscleGroup, 
          E.idUser, 
          U.username, 
          E.idUser = ? AS owner, 
          E.createdAt,
          M.nameMedia
        FROM Exercises E
        LEFT JOIN exerciseMedia M ON E.id = M.idExercise
        LEFT JOIN users U ON U.id = E.idUser
        WHERE M.idExercise = ? AND E.id = ?
        GROUP BY E.id
        ORDER BY E.createdAt DESC
      `,
      [idUser, idExercise, idExercise]
    );

    // consulta para obtener el conteo de "me gusta"
    const [likes] = await connection.query(
      `
        SELECT 
        COUNT(*) as likes,
        BIT_OR(L.idUser = ?) AS likedByMe
        FROM likesExercises L
        WHERE idExercise = ?
      `,
      [idUser, idExercise]
    );

    const [favorites] = await connection.query(
      `
        SELECT BIT_OR(F.idUser = ?) AS favedByMe
        FROM favsRutines F
        WHERE idExercise = ? AND idUser = ?
      `,
      [idUser, idExercise, idUser]
    );

    if (exercises.length < 1) {
      throw generateError("No se ha encontrado ningun ejercicio", 404);
    }
    exercises[0].likes = likes[0].likes;
    exercises[0].likedByMe = likes[0].likedByMe;
    exercises[0].favedByMe = favorites[0].favedByMe;

    return {
      ...exercises[0],
    };
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectExerciseByIdQuery;
