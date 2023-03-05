const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");
const selectAllExercisesQuery = require("../exercises/selectAllExercisesQuery");

const selectRutineByIdQuery = async (idUser, idRutine) => {
  let connection;

  try {
    connection = await getConnection();

    const [rutines] = await connection.query(
      `
                SELECT 
                  R.id,
                  R.name, 
                  R.description, 
                  R.duration, 
                  R.idUser, 
                  
                  COUNT(L.id) AS likes,
                 
                  BIT_OR(L.idUser = ?) AS likedByMe,
                  R.idUser = ? AS owner, 
                  R.createdAt
                FROM rutines R
                
                LEFT JOIN likesrutines L ON R.id = L.idRutine
                WHERE R.id = ?
                GROUP BY R.id
                ORDER BY R.createdAt DESC
            `,
      [idUser, idUser, idRutine]
    );
    if (rutines.length < 1) {
      throw generateError("No se ha encontrado ninguna rutina", 404);
    }
    console.log("perico antes", rutines[0]);
    const [favorites] = await connection.query(
      `
      SELECT 
      COUNT(F.id) AS exercisesOnRutine
      
      FROM favsRutines F
      WHERE idRutine = ? 
    `,
      [idRutine]
    );

    const [likes] = await connection.query(
      `SELECT 
       COUNT(L.id) AS likes
       FROM likesRutines L
       WHERE L.idRutine = ? 
       ORDER BY L.createdAt DESC`,
      [idRutine]
    );
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
        INNER JOIN favsRutines FR ON E.id = FR.idExercise
        WHERE FR.idRutine = ?
        GROUP BY FR.id
        ORDER BY E.createdAt DESC
      `,
      [idUser, idUser, idRutine]
    );
    const [favs] = await connection.query(
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
      const favorite = favs.find((fav) => fav.idExercise === exercise.id);
      exercise.favedByMe = !!favorite && favorite.favedByMe;
    });

    // const exercises = await selectAllExercisesQuery(idUser);
    // console.log("perico", exercises);

    // Añadimos los ejercicios al objeto de la rutina
    rutines[0].exercises = exercises;
    rutines[0].exercisesOnRutine = favorites[0].exercisesOnRutine;
    rutines[0].likes = likes[0].likes;

    return {
      ...rutines[0],
    };
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectRutineByIdQuery;
