const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const selectExerciseByIdQuery = async (idUser, idExercise) => {
  let connection;

  try {
    connection = await getConnection();

    const [exercises] = await connection.query(
      `
                SELECT 
                  E.id,
                  E.name, 
                  E.description, 
                  E.muscleGroup, 
                  E.idUser, 
                  COUNT(L.id) AS likes, 
                  BIT_OR(L.idUser = ?) AS likedByMe, 
                  E.idUser = ? AS owner, 
                  E.createdAt
                FROM Exercises E
                LEFT JOIN likesExercises L ON E.id = L.idExercise
                WHERE E.id = ?
                GROUP BY E.id
                ORDER BY E.createdAt DESC
            `,
      [idUser, idUser, idExercise]
    );

    const [media] = await connection.query(
      `SELECT id, nameMedia FROM exerciseMedia WHERE idExercise = ?`,
      [idExercise]
    );

    if (exercises.length < 1) {
      throw generateError("No se ha encontrado ningun ejercicio", 404);
    }

    return {
      ...exercises[0],
      media,
    };
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectExerciseByIdQuery;
