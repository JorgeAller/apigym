const getConnection = require("../../getConnection");

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
      await connection.query(
        `DELETE FROM likesRutines WHERE idUser = ? AND idRutine = ?`,
        [idUser, idRutine]
      );
      const msg = "eliminado";
      return msg;
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
