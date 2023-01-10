# TÍTULO

Aplicación para organizar internamente los entrenamientos en un gimnasio.

# DESCRIPCIÓN

Implementar una API que permita publicar ejercicios para la gestión de los mismos en un
gimnasio. Los usuarios serán los trabajadores del gimnasio.

# INSTALAR

- Crear una base de datos vacía en una instancia de MySQL local.

- Guardar el archivo `.env.example` como `.env` y cubrir los datos necesarios.

- Ejecutar `npm run initDB` para crear las tablas necesarias en la base de datos anteriormente creada.

- Ejecutar `npm run dev` o `npm start` para lanzar el servidor.

# TIPOS DE USUARIO

## USUARIOS ANÓNIMOS

Pueden ver la landing de la plataforma donde podrán registrarse o hacer login.

## ADMINISTRADOR

- Tiene el poder total de la Aplicación.
- Puede crear/modificar/eliminar ejercicios y rutinas, para controlar las que son subidas por los coachs.

## COACH

- Tendrá la posibilidad de crear/modificar/eliminar un nuevo ejercicio:

  - nombre
  - descripción
  - foto
  - Vídeo
  - grupo muscular

- Puede crear/modificar/eliminar rutinas de entreno para los usuarios, que contendrán diferentes ejercicios (Propios u ajenos de otros coachs)
  - nombre
  - descripción
  - Duración
  - Ejercicios

## USUARIO (NORMAL)

- Puede ver el listado de los ejercicios y entrar en el detalle de los mismos.
- Podrá filtrarlos por algunas características (ej: nombre, grupo muscular).
- Podrá poner o quitar un like a un ejercicio.
- Podrá añadir un ejercicio a una nueva rutina creada por el mismo.
- Podrá añadir a favoritos cada rutina.

# BASE DE DATOS

- **`users:`** id, , username`*`, email`*`, password`*`, avatar, role ("admin" "coach" "normal"), createdAt, modifiedAt.

- **`exercises:`** id, name`*`, description`*`, photo`*`, muscleGroup`*`, idUser, createdAt modifiedAt.

- **`likesExercises:`** id, idUser, idExercise, createdAt.

- **`exerciseMedia:`** id, name`*`, idExercise, createdAt, modifiedAt.

- **`rutines:`** id, name`*`, duration`*`, description`*`, idUser, idExercise, createdAt modifiedAt.

- **`favsRutines:`** id, idUser, idRutine, createdAt.

# A VER

Tabla users

- id: Un identificador único para cada usuario.
- **`email:`** El correo electrónico del usuario. Este campo es único y no puede ser nulo.
- **`username:`** El nombre de usuario del usuario. Este campo es único y no puede ser nulo.
- **`password:`** La contraseña del usuario. Este campo no puede ser nulo.
- **`avatar`**:`\*\* El nombre del archivo de la foto de perfil del usuario.
- **`role:`** El rol del usuario. Puede ser "admin", "coach" o "normal".
- **`createdAt:`** La fecha y hora en la que el usuario se registró.
- **`modifiedAt:`** La fecha y hora en la que el usuario se modificó.
- **`deleted:`** Indica si el usuario ha sido eliminado.
- **`deletedAt:`** La fecha y hora en la que el usuario se eliminó.

# ENDPOINTS DE LA APLICACIÓN

A continuación se detallan los diferentes endpoints de la aplicación y su funcionalidad: \
\*`WIP = Work In Progress`

- ## **Usuarios**

  - **POST** - `/users`: crear un nuevo usuario. ✅
  - **POST** - `/users/login`: iniciar sesión con un usuario existente. (Retorna un token) ✅
  - **GET** - `/users/id/:idUser`: obtener los datos de un usuario por su id. Si obtienes los datos de tu usuario, obtendrás más información privada (email, [...]) (Token)✅

  - **GET** - `/users/name/:username`: obtener los datos de un usuario por su username. Si obtienes los datos de tu usuario, obtendrás más información privada (email, [...]). Si el usuario es un admin, ocultará el rol y pondrá que es un usuario coach (Token)✅
  - **PATCH** - `/users`: modificar el avatar o el email de un usuario. (Token) ✅
  - **DELETE** - `/users` Elimina a un usuario !!!!!!!! Cuidado con eliminar o anonimizar o que hacer ✅
  - **DELETE** - `/users/delete/:username`: Permite a un usuario administrador borrar un usuario por su username.

//

- ## **Ejercicios**

  - **POST** - `/exercises`: crear un nuevo ejercicio (Con imagen obligatoria). Solo pueden subir ejercicios los coachs y admins. Trabajando en poder subir también vídeo descriptivo del ejercicio. (Token) ✅
  - **GET** - `/exercises`: Lista de todos los ejercicios. (y buscar por palabra clave en la descripción) (Token Opcional)✅
  - **GET** - `/exercises/:idExercise`: obtener los datos de un ejercicio por su ID. (Token opcional) ✅
  - **PATCH** - `/exercises/:idExercise`: modificar los datos de un ejercicio por su ID. (Token) ✅

  - **DELETE** - `/exercises/:idExercise`: eliminar un ejercicio por su ID. El coach que lo creó o un admin (Token) ✅
  - **GET** - `/exercises/filter`: filtrar ejercicios por nombre, descripción , grupo muscular. ✅
  - **POST** - `/exercises/:idExercise/likes`: dar like a un ejercicio. (Token) ✅
  - **DELETE** - `/exercises/:idExercise/likes`: eliminar un like a un ejercicio. ✅

  - **POST** - `/exercises/:idexercise/rutines/:idRutine/`: añadir una ejercicio a una rutina (token) ✅
  - **DELETE** - `/exercises/:idExercise/rutines/:idRutine/favorites/:idFav`: eliminar un ejercicio de una rutina (token)✅  
    Primero comprueba si exsite el ejercicio, luego la rutina, y luego comprueba si el Favorito existe o no (Desde selectFavQuery y no con Middleware `[WIP-Añadir middleware de favExists.js]`)  
    Luego comprueba que eres propietario de esa rutina. Luego que esa rutina contenga ese ejercico.  
     Y por último que ese ejercicio de esa rutina tenga ese id

//

- ## **Rutinas**

  - **POST** - `/routines`: crear una nueva rutina. (Listado de ejercicios a los que le das favorito/add to rutine) (Token)✅
  - **GET** - `/routines`: obtener la lista de todas las rutinas. (Token Opcional)✅
  - **GET** - `/routines/:idRutine`: obtener los datos de una rutina por su ID. (Token Opcional)✅
  - **PATCH** - `/routines/:idRutine`: modificar los datos de una rutina por su ID. (Token) `WIP`

  - **DELETE** - `/routines/:idRutine`: eliminar una rutina por su ID. El coach y el usuario, podrán borrar solo sus rutinas. El admin cualquiera. (Token) ✅

//

## **(DUDAS)**

- Estructura SQL✅
- Que método tenemos que usar para diferenciar la ruta de busqueda de usuarios por id o username.✅
- Problema al eliminar usuarios (borrado logico sin borrar del todo el usuario)✅
- Mejor dependencia para subir videos o animaciones gif ✅
- Igual que buscamos un ejercicio con keywords, tiene más sentido hacer un endpoint de busqueda de usuarios o buscar con keywords los usuarios
- Para eliminar un ejercicio o rutina es igual que con los usuarios o hay que hacer algo diferente✅
- Es mejor tener los endpoints de las reacciones en rutas diferentes o directamente en la del contenido (/likes/:idExercise o /exercises/:idExercise/likes)✅
