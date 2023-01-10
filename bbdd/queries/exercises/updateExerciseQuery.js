const getConnection = require("../../getConnection");

const updateExerciseQuery = async (
  name,
  description,
  muscleGroup,
  media,
  idExercise
) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `UPDATE exercises SET name = ?, description = ?, muscleGroup = ?, modifiedAt = ? WHERE id = ?`,
      [name, description, muscleGroup, new Date(), idExercise]
    );

    await connection.query(
      `UPDATE exerciseMedia SET nameMedia = ?, modifiedAt = ? WHERE idExercise = ?`,
      [media, new Date(), idExercise]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateExerciseQuery;
