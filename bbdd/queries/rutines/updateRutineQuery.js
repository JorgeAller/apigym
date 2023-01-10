const getConnection = require("../../getConnection");

const updateExerciseQuery = async (name, description, duration, idRutine) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `UPDATE rutines SET name = ?, description = ?, duration = ?, modifiedAt = ? WHERE id = ?`,
      [name, description, duration, new Date(), idRutine]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateExerciseQuery;
