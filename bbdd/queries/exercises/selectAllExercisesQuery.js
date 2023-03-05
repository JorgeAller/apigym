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
                  U.username, 
                  COUNT(L.id) AS likes, 
                  BIT_OR(L.idUser = ?) AS likedByMe, 
                  
                  E.idUser = ? AS owner, 
                  E.createdAt,
                  M.nameMedia
                FROM Exercises E
                LEFT JOIN likesExercises L ON E.id = L.idExercise
               
                LEFT JOIN exerciseMedia M ON E.id = M.idExercise
                LEFT JOIN users U ON U.id = E.idUser
                WHERE E.name LIKE ?
                AND E.description LIKE ?
                AND E.muscleGroup LIKE ?
                GROUP BY E.id
                ORDER BY E.createdAt DESC
            `,
      [idUser, idUser, `%${name}%`, `%${keywordDesc}%`, `%${muscleGroup}%`]
    );

    const [favorites] = await connection.query(
      `
        SELECT 
        F.idExercise,
        BIT_OR(F.idUser = ?) AS favedByMe
        FROM favsRutines F
        WHERE F.idUser = ?
        GROUP BY F.idExercise
      `,
      [idUser, idUser]
    );

    exercises.forEach((exercise) => {
      const favorite = favorites.find((fav) => fav.idExercise === exercise.id);
      exercise.favedByMe = !!favorite && favorite.favedByMe;
    });

    /*   if (exercises.length < 1) {
      throw generateError("No se ha encontrado ningun ejercicio", 404);
    } */

    return exercises;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectAllExercisesQuery;
