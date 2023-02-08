const getConnection = require("../../getConnection");

const insertRutineQuery = async (name, description, duration, idUser) => {
  let connection;

  try {
    connection = await getConnection();

    // Insertamos la rutina y obtenemos los datos del mismo.
    const [newRutine] = await connection.query(
      `
                INSERT INTO rutines (name, description, duration ,idUser, createdAt)
                VALUES (?, ?, ?, ?, ?)
            `,
      [name, description, duration, idUser, new Date()]
    );

    // Retornamos el id que le ha asignado la base de datos a este nuevo ejercicio
    return newRutine.insertId;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertRutineQuery;
