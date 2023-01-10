const getConnection = require("../bbdd/getConnection");

const { generateError } = require("../helpers");

const rutineExists = async (req, res, next) => {
  let connection;

  try {
    connection = await getConnection();

    const { idRutine } = req.params;

    // Comprobamos que la rutina exista
    const [rutines] = await connection.query(
      `SELECT * FROM rutines WHERE id = ?`,
      [idRutine]
    );

    if (rutines.length < 1) {
      throw generateError("Rutina no encontrada", 404);
    }

    // Pasamos el control a la siguiente función controladora.
    next();
  } catch (err) {
    next(err);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = rutineExists;
