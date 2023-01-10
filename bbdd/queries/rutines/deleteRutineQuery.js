const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const deleteRutineQuery = async (idRutine) => {
  let connection;

  try {
    connection = await getConnection();

    // Seleccionamos ejercicio.
    const [rutines] = await connection.query(
      `SELECT id FROM rutines WHERE id = ?`,
      [idRutine]
    );

    // Borramos todos los likes relacionados con la rutina que queremos eliminar
    await connection.query(`DELETE FROM likesrutines WHERE idRutine = ?`, [
      idRutine,
    ]);

    // Borramos todos los ejercicios que contiene la rutina que queremos eliminar
    await connection.query(`DELETE FROM favsrutines WHERE idRutine = ?`, [
      idRutine,
    ]);

    // Borramos el ejercicio.
    await connection.query(`DELETE FROM rutines WHERE id = ?`, [idRutine]);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteRutineQuery;
