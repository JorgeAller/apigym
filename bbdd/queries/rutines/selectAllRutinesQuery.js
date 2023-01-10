const getConnection = require("../../getConnection");

const selectAllRutinesQuery = async (idUser, name, keywordDesc, duration) => {
  let connection;

  if (!name) name = "";
  if (!keywordDesc) keywordDesc = "";
  if (!duration) duration = "";

  try {
    connection = await getConnection();
    console.log(idUser);
    const [rutines] = await connection.query(
      `
                SELECT 
                  R.id,
                  R.name, 
                  R.description, 
                  R.duration, 
                  R.idUser, 
                  COUNT(F.id) AS exercisesOnRutine,
                  BIT_OR(F.idUser = ?) AS addedByMe,
                  R.idUser = ? AS owner, 
                  R.createdAt
                FROM Rutines R
                LEFT JOIN favsRutines F ON R.id = F.idRutine
                WHERE 1=1
                AND R.name LIKE ?
                AND R.description LIKE ?
                AND R.duration LIKE ? 
                GROUP BY R.id
                ORDER BY R.createdAt DESC
            `,
      [idUser, idUser, `%${name}%`, `%${keywordDesc}%`, `%${duration}%`]
    );

    /*   if (Rutines.length < 1) {
      throw generateError("No se ha encontrado ningun ejercicio", 404);
    } */

    return rutines;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectAllRutinesQuery;
