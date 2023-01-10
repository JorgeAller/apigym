const getConnection = require("../../getConnection");

const insertMediaQuery = async (media, idExercise) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `INSERT INTO ExerciseMedia (nameMedia, idExercise, createdAt) VALUES (?, ?, ?)`,
      [media, idExercise, new Date()]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertMediaQuery;
