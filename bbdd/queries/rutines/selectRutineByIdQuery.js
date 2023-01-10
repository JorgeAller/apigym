const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const selectRutineByIdQuery = async (idUser, idrutine) => {
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
                  COUNT(F.id) AS favs, 
                  BIT_OR(F.idUser = ?) AS favAddedByMe, 
                  R.idUser = ? AS owner, 
                  R.createdAt
                FROM rutines R
                LEFT JOIN favsrutines F ON R.id = F.idrutine
                WHERE R.id = ?
                GROUP BY R.id
                ORDER BY R.createdAt DESC
            `,
      [idUser, idUser, idrutine]
    );

    if (rutines.length < 1) {
      throw generateError("No se ha encontrado ninguna rutina", 404);
    }

    return {
      ...rutines[0],
    };
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectRutineByIdQuery;
