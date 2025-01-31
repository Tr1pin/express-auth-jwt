import express from 'express';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './middlewares/cors.js'
import jwtMiddleware from './middlewares/jwt.js';
import { userRouter } from './routes/users.js'
import { UserModel } from './models/mysql/users.js'
import { AuthModel } from './models/auth/authModel.js'; 

import { DEFAULT_PORT } from './config.js';

export const createApp = ({ userModel }, { authModel }) => {
  const app = express();

  app.set('view engine', 'ejs');
  app.disable('x-powered-by')

  app.use(cookieParser());
  app.use(jwtMiddleware);
  app.use(corsMiddleware());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  

  app.use('/users', userRouter({ userModel }))
  app.use('/', userRouter({ authModel}))


  const PORT = process.env.PORT ?? DEFAULT_PORT;

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
  });

  return app;
};

createApp({ userModel: UserModel }, { authModel: AuthModel }); 
