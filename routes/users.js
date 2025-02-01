import { Router } from 'express'
import { UserController } from '../controllers/data/users.js'
import { UserAuthController } from '../controllers/auth/userlog.js'

export const userRouter = ({ userModel, authModel }) => {
  const router = Router(); // Crea una instancia de Router

  const userController = new UserController({ userModel })
  const userAuthController = new UserAuthController({ authModel })

  router.get('/role/:role', userController.getByRole)


  router.get('/id/:id', userController.getId) // Define correctamente la ruta con un parámetro :id

  router.delete('/:id', userController.delete)
  router.patch('/:id', userController.update)

  //Auth
  router.post('/login', userAuthController.login)
  router.post('/register', userAuthController.register)
  router.post('/logout', userAuthController.logout)
  router.get('/protected', userAuthController.protected)
  router.get('/', userAuthController.home)

  return router; // Retorna el router configurado
};
