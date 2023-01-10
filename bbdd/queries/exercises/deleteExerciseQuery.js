const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const deleteExerciseQuery = async (idUser, idExercise) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(`SELECT idUser FROM exercises WHERE idUser = ?`, [
      idUser,
    ]);

    // Borramos todos los likes relacionados con el ejercicio que queremos eliminar
    await connection.query(`DELETE FROM likesexercises WHERE idExercise = ?`, [
      idExercise,
    ]);

    // Borramos todo el contenido media relacionado con el ejercicio que queremos eliminar
    await connection.query(`DELETE FROM exerciseMedia WHERE idExercise = ?`, [
      idExercise,
    ]);

    // Borramos el ejercicio de todas las rutinas a las que está añadido
    await connection.query(`DELETE FROM favsrutines WHERE idExercise = ?`, [
      idExercise,
    ]);

    // Borramos el ejercicio.
    await connection.query(`DELETE FROM exercises WHERE id = ?`, [idExercise]);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteExerciseQuery;
