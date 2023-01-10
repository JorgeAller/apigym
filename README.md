# TÍTULO

Aplicación para organizar internamente y externamente los entrenamientos en un gimnasio.

# DESCRIPCIÓN

Implementar una API que permita publicar ejercicios para la gestión de los mismos en un
gimnasio. Los usuarios serán los trabajadores y usuarios del gimnasio.

Aplicación con rutinas predeterminadas y biblioteca de ejercicios para los usuarios de un gimnasio.

Esta biblioteca de ejercicios, estará creada por los "Coachs" (y "admins") que se registren en esta plataforma. Un usuario del gimnasio "normal" no podrá registrarse como "coach" o "admin", sin permiso del gimnasio.

Las rutinas podrán ser creadas por cualquier tipo de usuario, y podrán añadir mediante un Favorito cualquier ejercicio de esta bilbioteca a sus rutinas.
Al mismo tiempo, habrá una serie de rutinas predeterminadas para diferentes necesidades, que no podrán ser modificadas (solamente por sus creadores).
Para guardar estas rutinas en tu perfil, y utilizarlas mas adelante, podrás guardarlas mediante un like.

Los ejercicios también podrán ser guardados mediante un like. Así tendrás una lista de tus ejercicios preferidos, que más tarde podrás añadir a tus rutinas.

Tanto los ejercicios como las rutinas, podrán ser buscados y listados al completo. Podrás filtrar esta búsqueda por los parámetros que tendrá cada elemento.

# TIPOS DE USUARIO

## USUARIOS ANÓNIMOS

Pueden ver la landing page de la plataforma donde podrán registrarse, hacer login e información acerca del gimnasio (HORARIOS, NOTICIAS, CONTACTO, ETC)

## ADMINISTRADOR

- Tiene el poder total de la Aplicación.
- Puede crear/modificar/eliminar ejercicios y rutinas, para controlar las que son subidas por los coachs.
- Puede modificar cualquier cosa. Eliminar likes, eliminar ejercicios de rutinas, modificar usuarios, etc .

**WIP** Estamos trabajando en implementar estas funciones al completo. De momento solo pueden eliminar rutinas y ejercicios sin tener que ser sus creadores.

## COACH

- Tendrá la posibilidad de crear/modificar/eliminar un nuevo ejercicio:

  - nombre
  - descripción
  - grupo muscular
  - media (**WIP** Estamos trabajando en implementar la súbida de archivos de vídeo. Por el momento solo se pueden importar imágenes)

- Puede crear/modificar/eliminar rutinas de entreno para los usuarios, que contendrán diferentes ejercicios (Propios u ajenos de otros coachs)

  - nombre
  - descripción
  - Duración (Esta no será obligatoria al crear la rutina. Podrá ser modificada una vez sean añadidos los ejercicos)

  Para añadir un ejercicio a esta rutina, deberás darle favorito al ejercicio que quieras implementar.  
  Puedes añadir el mismo ejercicio las veces que quieras.

## USUARIO (NORMAL)

- Puede ver el listado de los ejercicios y entrar en el detalle de los mismos.
- Podrá filtrarlos por algunas características (ej: nombre, grupo muscular, descripcion).
- Podrá poner o quitar un like a un ejercicio existente.
- Podrá añadir ejercicios o quitarlos a una rutina creada por el mismo.
- Podrá añadir o quitar un like a cada rutina existente. (Manera de guardar las rutinas del resto de usuarios)

# INSTALAR

- Crear una base de datos vacía en una instancia de MySQL Workbench con el nombre de apigym.

- Copia el archivo `.env.example` y pega su contenido en un archivo `.env` y cubre los datos necesarios con tus datos privados.

- Ejecuta en el terminal el comando `npm i -y` para instalar todas las dependencias necesarias del proyecto.

- Ejecutar `npm run bbdd/initDB.js` para crear las tablas necesarias en la base de datos anteriormente creada y añadir un usario administrador.

- Ejecutar `npm run dev` o `npm start` para lanzar el servidor.

# BASE DE DATOS

- **`users:`** id, , username`*`, email`*`, password`*`, avatar, role`*`("admin" "coach" "normal"), createdAt`*`, modified, modifiedAt, deleted, deletedAt.

- **`exercises:`** id, name`*`, description`*`, muscleGroup`*`, idUser`*`, createdAt`*`, modifiedAt.

- **`likesExercises:`** id, idUser`*`, idExercise`*`, createdAt`*`.

- **`exerciseMedia:`** id, nameMedia`*`, idExercise`*`, createdAt`*`, modifiedAt.

- **`rutines:`** id, name`*`, duration`*`, description`*`, idUser`*`, createdAt`*`, modifiedAt.

- **`favsRutines:`** id, idRutine`*`, idExercise`*`, idUser`*`, createdAt`*`, modifiedAt

`*` Indica que el valor de esa columna no puede ser NULL

**WIP** Estamos trabajando en implementar el borrado lógico en todas las tablas.  
Por el momento solo está añadido en la tabla de users, pero nos gustaría que fuese igual en el resto de tablas.

**WIP** Estamos trabajando en implementar que el valor del parámetro muscleGroup de la tabla exercises en vez de ser un VARCHAR en el que escribas el valor que sea, tengas que escribir/seleccionar uno de los doce grupos musculars. (Mediante un ENUM y insertando la informacion en el archivo .env)

# ENDPOINTS DE LA APLICACIÓN

A continuación se detallan los diferentes endpoints de la aplicación y su funcionalidad: \
\*`WIP = Work In Progress`

**WIP** Estamos trabajando en utilizar la herramienta de validación de datos del módulo Joi. Comprobamos todos los datos que se ingresan exclusivamente con los parámetros de nuestras código SQL que crea las tablas de la base de datos.  
Implementaremos esta validación de datos, para comprobar que esa información que se está insertando en nuestra base de datos, es la correcta y la que busca nuestro backend.

- ## **Usuarios**

  - **POST** - `/users`: crear un nuevo usuario. ✅
  - **POST** - `/users/login`: iniciar sesión con un usuario existente. (Retorna un token) ✅
  - **GET** - `/users/id/:idUser`: obtener los datos de un usuario por su id. Si obtienes los datos de tu usuario, obtendrás más información privada (email, [...`Más valores más adelante`]) (Token)✅

  - **GET** - `/users/name/:username`: obtener los datos de un usuario por su username. Si obtienes los datos de tu usuario, obtendrás más información privada (email, [...`más valores más adelante`]). Si el usuario es un admin, ocultará el rol y pondrá que es un usuario coach (Token)✅
  - **PATCH** - `/users`: modificar el avatar, el role o el email de un usuario. (Token) ✅
  - **DELETE** - `/users` Elimina a un usuario de manera lógica ✅ **WIP** Estamos trabajando en que al hacer el borrado logico, elimine el token de ese usuario para que no pueda realizar más cambios

  **WIP** Estamos trabajando en implementar este endpoint.

  - **DELETE** - `/users/delete/:username`: Permite a un usuario administrador borrar un usuario por su username.

//

- ## **Ejercicios**

  - **POST** - `/exercises`: crear un nuevo ejercicio (Con imagen obligatoria). Solo pueden subir ejercicios los coachs y admins. **WIP** Trabajando en poder subir también vídeo descriptivo del ejercicio. (Token) ✅
  - **GET** - `/exercises`: Lista de todos los ejercicios. (y buscar por palabra clave en la descripción, por muscleGroup y por nombre) (Token Opcional)✅
  - **GET** - `/exercises/:idExercise`: obtener los datos de un ejercicio por su ID. (Token opcional) ✅
  - **PATCH** - `/exercises/:idExercise`: modificar los datos de un ejercicio por su ID. (Token) ✅

  - **DELETE** - `/exercises/:idExercise`: eliminar un ejercicio por su ID. El coach que lo creó o un admin (Token) ✅

  - **POST** - `/exercises/:idExercise/likes`: dar like a un ejercicio. (Token) ✅
  - **DELETE** - `/exercises/:idExercise/likes`: eliminar un like a un ejercicio. ✅

  - **POST** - `/exercises/:idexercise/rutines/:idRutine/`: añadir una ejercicio a una rutina. Las veces que quieras. Esto es dar un favorito al ejercio(token) ✅
  - **DELETE** - `/exercises/:idExercise/rutines/:idRutine/favorites/:idFav`: eliminar un ejercicio de una rutina. Quitar el fav(token)✅  
    Primero comprueba si exsite el ejercicio, luego la rutina, y luego comprueba si el Favorito existe o no (Desde selectFavQuery y no con Middleware `[WIP-Añadir middleware de favExists.js]`)  
    Luego comprueba que eres propietario de esa rutina. Luego que esa rutina contenga ese ejercico.  
     Y por último que ese ejercicio de esa rutina tenga ese id

//

- ## **Rutinas**

  - **POST** - `/routines`: crear una nueva rutina. (Listado de ejercicios a los que le das favorito/add to rutine) (Token)✅
  - **GET** - `/routines`: obtener la lista de todas las rutinas. (Token Opcional)✅
  - **GET** - `/routines/:idRutine`: obtener los datos de una rutina por su ID. (Token Opcional)✅
  - **PATCH** - `/routines/:idRutine`: modificar los datos de una rutina por su ID. (Token)
  - **DELETE** - `/routines/:idRutine`: eliminar una rutina por su ID. El coach y el usuario, podrán borrar solo sus rutinas. El admin cualquiera. (Token) ✅
  - **GET** - `/rutines/:idRutine/likes`: dar like a una rutina (Token)
  - **DELETE** - `/rutines/:idRutine/likes`: eliminar un like de una rutina (Token)

//

## **(DUDAS YA RESUELTAS)**

- Estructura SQL✅
- Que método tenemos que usar para diferenciar la ruta de busqueda de usuarios por id o username.✅
- Problema al eliminar usuarios (borrado logico sin borrar del todo el usuario)✅
- Mejor dependencia para subir videos o animaciones gif ✅
- Igual que buscamos un ejercicio con keywords, tiene más sentido hacer un endpoint de busqueda de usuarios o buscar con keywords los usuarios
- Para eliminar un ejercicio o rutina es igual que con los usuarios o hay que hacer algo diferente✅
- Es mejor tener los endpoints de las reacciones en rutas diferentes o directamente en la del contenido (/likes/:idExercise o /exercises/:idExercise/likes)✅
