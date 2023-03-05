const getConnection = require("../../getConnection");

const selectAllRutinesQuery = async (idUser, name, keywordDesc, duration) => {
  let connection;

  if (!name) name = "";
  if (!keywordDesc) keywordDesc = "";
  if (!duration) duration = "";

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
                  U.username, 
                  IFNULL(GROUP_CONCAT(DISTINCT F.idExercise SEPARATOR ','), '') AS favsRutinesIds,
                  COUNT(DISTINCT F.id) AS exercisesOnRutine,
                  COUNT(DISTINCT L.id) AS likes, 
                  BIT_OR(F.idUser = ?) AS addedByMe,
                  BIT_OR(L.idUser = ?) AS likedByMe,
                  R.idUser = ? AS owner, 
                  R.createdAt
                FROM Rutines R
                LEFT JOIN favsRutines F ON R.id = F.idRutine
                LEFT JOIN likesrutines L ON R.id = L.idRutine
                LEFT JOIN users U ON U.id = R.idUser
                WHERE 1=1
                AND R.name LIKE ?
                AND R.description LIKE ?
                AND R.duration LIKE ? 
                GROUP BY R.id
                ORDER BY R.createdAt DESC
            `,
      [idUser, idUser, idUser, `%${name}%`, `%${keywordDesc}%`, `%${duration}%`]
    );

    /*   if (Rutines.length < 1) {
      throw generateError("No se ha encontrado ningun ejercicio", 404);
    } */

    console.log(rutines);
    return rutines;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectAllRutinesQuery;
