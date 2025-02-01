Express Auth JWT

Este es un proyecto de autenticación de usuarios en Node.js utilizando Express y JSON Web Tokens (JWT). Proporciona un sistema seguro de inicio de sesión y protección de rutas mediante tokens JWT.

Características

Registro y autenticación de usuarios.

Generación de tokens JWT.

Protección de rutas mediante middleware de autenticación.

Hashing de contraseñas con bcrypt.

Tecnologías utilizadas

Node.js

Express.js

JSON Web Token (JWT)

Bcrypt.js

MySQL

Instalación

Clona el repositorio:

git clone https://github.com/Tr1pin/express-auth-jwt/
cd express-auth-jwt

Instala las dependencias:

pnpm install

Configura las variables de entorno creando un archivo .env:

Inicia el servidor:

pnpm run dev

Puedes realizar pruebas con el archivo api.http, instalando la extensión REST CLIENT
