const getConnection = require("../../getConnection");

const insertExerciseQuery = async (name, description, muscleGroup, idUser) => {
  let connection;

  try {
    connection = await getConnection();

    // Insertamos el ejercicio y obtenemos los datos del mismo.
    const [newExercise] = await connection.query(
      `
                INSERT INTO exercises (name, description, muscleGroup ,idUser, createdAt)
                VALUES (?, ?, ?, ?, ?)
            `,
      [name, description, muscleGroup, idUser, new Date()]
    );

    console.log(newExercise);

    // Retornamos el id que le ha asignado la base de datos a este nuevo ejercicio
    return newExercise.insertId;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertExerciseQuery;
