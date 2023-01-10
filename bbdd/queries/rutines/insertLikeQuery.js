const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");
const selectRutineByIdQuery = require("./selectRutineByIdQuery");

const insertLikeQuery = async (idUser, idRutine) => {
  let connection;

  try {
    connection = await getConnection();

    // Comprobamos si el usuario ya ha dado like al ejercicio
    const [likes] = await connection.query(
      `SELECT id FROM likesRutines WHERE idUser = ? AND idRutine = ?`,
      [idUser, idRutine]
    );

    if (likes.length > 0) {
      throw generateError(
        "No puedes dar like dos veces a la misma rutina",
        403
      );
    }

    await connection.query(
      `
        INSERT INTO likesRutines (idUser, idRutine, createdAt) 
        VALUES (?, ?, ?)
        `,
      [idUser, idRutine, new Date()]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertLikeQuery;
