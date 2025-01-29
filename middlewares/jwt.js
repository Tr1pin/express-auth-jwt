import { SECRET_KEY } from '../config.js';

const jwt = import('jsonwebtoken');
const KEY = process.env.SECRET_KEY || SECRET_KEY

export default (req, res, next) => {
  req.session = { user: null };
  const token = req.cookies?.access_token;

  if (token) {
    try {
      const data = jwt.verify(token, KEY);
      req.session.user = data;
    } catch (error) {
      console.error('Token inválido o expirado:', error.message);
    }
  }

  next();
};

