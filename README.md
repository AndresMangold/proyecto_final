# Cuarta Preentrega del curso de Programación Backend.

Este proyecto simula un servidor con persistencia de archivos alojado MONGODB y donde es posible visualizar productos y añadirlos a un carrito de compras.

Se agregó para esta entrega: 
- Nueva localización de la ruta /api/users/premium/:uid
- Para actualizar a premium se agregaron condiciones.
- Nueva propiedad en el User model: "documents" (incluyendo profiles, products y documents), "last_connection".
- Nuevo endpoint: api/users/:uid/documents

Se podrá consultar productos disponibles utilizando filtros, paginación y ordenamientos.


# Para correr este proyecto:

- git clone https://github.com/AndresMangold/Backend_Reordenamiento_Mangold/tree/cuarta-practica-integradora
- npm i
- nodemon ./src/app.js
- [localhost:8080//](http://localhost:8080/)


# Frameworks y librerías utilizadas en este proyecto:

- Node JS
- Node Express
- Express
- Express Handlebars
- Express Sessions
- Handlebars
- Socket.io
- Mongoose
- Mongoose Paginate
- Session-file-store
- Connect-mongo
- Cookie-parser
- DotEnv
- JsonWebToken
- Node
- NodeMailer
- Passport
- Passport: github2, jwt, local.
- Swagger
- Winston

# Para testear la API:


- Para Utilizar **SWAGGER**:
    - Iniciar Sesión a través del comando: ***nodemon ./src/app.js*** y entrar a [http://localhost:8080](http://localhost:8080/)
Una vez iniciada la sesión, abrir una pestaña con el endpoint: [http://localhost:8080/apidocs/](http://localhost:8080/apidocs)



- Para Utilizar los **TESTS**: Mocha, Chai y Supertest:
    - Desde la consola correr el comando ***npm test***