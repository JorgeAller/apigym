const getConnection = require("../bbdd/getConnection");

const { generateError } = require("../helpers");

const exerciseExists = async (req, res, next) => {
  let connection;

  try {
    connection = await getConnection();

    const { idExercise } = req.params;

    // Comprobamos que el ejercicio exista.
    const [exercises] = await connection.query(
      `SELECT * FROM exercises WHERE id = ?`,
      [idExercise]
    );

    if (exercises.length < 1) {
      throw generateError("Ejercicio no encontrado", 404);
    }

    // Pasamos el control a la siguiente función controladora.
    next();
  } catch (err) {
    next(err);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = exerciseExists;
