const getConnection = require("../../getConnection");

const selectAllExercisesQuery = async (
  idUser,
  name,
  keywordDesc,
  muscleGroup
) => {
  let connection;

  if (!name) name = "";
  if (!keywordDesc) keywordDesc = "";
  if (!muscleGroup) muscleGroup = "";

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
                WHERE E.name LIKE ?
                AND E.description LIKE ?
                AND E.muscleGroup LIKE ?
                GROUP BY E.id
                ORDER BY E.createdAt DESC
            `,
      [idUser, idUser, `%${name}%`, `%${keywordDesc}%`, `%${muscleGroup}%`]
    );

    /*   if (exercises.length < 1) {
      throw generateError("No se ha encontrado ningun ejercicio", 404);
    } */

    return exercises;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectAllExercisesQuery;
