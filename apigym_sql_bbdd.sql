CREATE DATABASE IF NOT EXISTS apigym;

-- DROP DATABASE apigym;

-- USE apigym;

DROP TABLE IF EXISTS favsRutines;
DROP TABLE IF EXISTS rutines;
DROP TABLE IF EXISTS exerciseMedia;
DROP TABLE IF EXISTS likesExercises;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS users;


-- Crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  avatar VARCHAR(100),
  role ENUM ('admin','coach', 'normal') DEFAULT 'normal',
  createdAt TIMESTAMP NOT NULL,
  modifiedAt TIMESTAMP
);

-- Crear la tabla de ejercicios
CREATE TABLE IF NOT EXISTS exercises (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  photo VARCHAR(255) NOT NULL,
  muscleGroup VARCHAR(255) NOT NULL,
  idUser INT UNSIGNED NOT NULL,
  FOREIGN KEY (idUser) REFERENCES users(id),
  createdAt TIMESTAMP NOT NULL,
  modifiedAt TIMESTAMP
);

-- Crear la tabla de likes que le dan los usuarios a los ejercicios
CREATE TABLE IF NOT EXISTS likesExercises (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  idUser INT UNSIGNED NOT NULL,
  FOREIGN KEY (idUser) REFERENCES users(id),
  idExercise INT UNSIGNED NOT NULL,
  FOREIGN KEY (idExercise) REFERENCES exercises(id),
  createdAt TIMESTAMP NOT NULL
);

-- Crear la tabla que contiene los archivos de foto y video de los ejercicios.
 CREATE TABLE IF NOT EXISTS exerciseMedia (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(100) NOT NULL,
	idExercise INT UNSIGNED NOT NULL,
	FOREIGN KEY (idExercise) REFERENCES exercises(id),
	createdAt TIMESTAMP NOT NULL,
	modifiedAt TIMESTAMP
);

-- Crear la tabla de rutinas
CREATE TABLE IF NOT EXISTS rutines (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  idUser INT UNSIGNED NOT NULL,
  FOREIGN KEY (idUser) REFERENCES users(id),
  idExercise INT UNSIGNED NOT NULL,
  FOREIGN KEY (idExercise) REFERENCES exercises(id),
  createdAt TIMESTAMP NOT NULL,
  modifiedAt TIMESTAMP
);


-- Crear la tabla de favoritos, para que los usuarios puedan guardar sus rutinas favoritas
CREATE TABLE IF NOT EXISTS favsRutines (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  idUser INT UNSIGNED NOT NULL,
  FOREIGN KEY (idUser) REFERENCES users(id),
  idRutine INT UNSIGNED NOT NULL,
  FOREIGN KEY (idRutine) REFERENCES rutines(id),
  createdAt TIMESTAMP NOT NULL
);

