import { Router } from 'express';
import { UserController } from '../controllers/data/users.js';

export const userRouter = ({ userModel }) => {
  const router = Router(); // Crea una instancia de Router

  const userController = new UserController({ userModel });

  router.get('/role/:role', userController.getByRole);
  router.post('/', userController.create);


  router.get('/id/:id', userController.getId); // Define correctamente la ruta con un parámetro :id

  router.delete('/:id', userController.delete);
  router.patch('/:id', userController.update);

  return router; // Retorna el router configurado
};
