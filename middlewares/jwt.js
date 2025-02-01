import { SECRET_KEY } from '../config.js';
import jwt from 'jsonwebtoken';

const KEY = process.env.SECRET_KEY || SECRET_KEY;

if (!KEY) {
  throw new Error("SECRET_KEY no está definido en las variables de entorno ni en config.js");
}

export default (req, res, next) => {
  req.session = { user: null };
  const token = req.cookies?.access_token;

  if (token) {
    try {
      const data = jwt.verify(token, KEY);
      req.session.user = data;
    } catch (error) {
      console.error('Token inválido o expirado:', error.message);
      res.clearCookie('access_token'); // Opcional: eliminar la cookie si es inválida
    }
  }

  next();
};
