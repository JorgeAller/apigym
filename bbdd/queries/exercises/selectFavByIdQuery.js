const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const selectFavByIdQuery = async (idFav) => {
  let connection;

  try {
    connection = await getConnection();

    const [favs] = await connection.query(
      `SELECT * FROM favsRutines WHERE  id = ?`,
      [idFav]
    );

    if (favs.length < 1) {
      throw generateError("No se ha encontrado ese favorito.", 404);
    }

    return {
      ...favs[0],
    };
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectFavByIdQuery;
