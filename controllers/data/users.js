import { validateUser, validatePartialUser } from '../../schemas/users.js'

export class UserController {
  constructor ( {userModel} ) { 
    this.userModel = userModel
  }

  getByRole = async (req, res) =>{
    console.log(req.params)
    const { role } = req.params
    const users = await this.userModel.getByRole({ role })
    console.log(users)
    if(!users) return res.status(404).json({ message: 'Users not found' })
    res.json(users)
  }

  getId = async (req, res) => {
    const { id } = req.params
    console.log("Controller byid");
    const user = await this.userModel.getById({ id })
    if (user) return res.json(user)
    res.status(404).json({ message: 'User not found' })
  }

  create = async (req, res) => {
    console.log("create");
    console.log("Body received in create:", req.body)
    const result = validateUser(req.body)

    console.log(result);
    if (!result.success) {
    // 422 Unprocessable Entity
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newUser = await this.userModel.create({ input: result.data })

    if (!newUser) {
      // 422 Unprocessable Entity
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }
    res.status(201).json(newUser)
  }

    delete = async (req, res) => {
    const { id } = req.params

    const result = await this.userModel.delete({ id })

    if (result[0] === false) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({ message: 'User deleted' })
  }

  update = async (req, res) => {
    const result = validatePartialUser(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updatedUser = await this.userModel.update({ id, input: result.data })

    return res.json(updatedUser)
  }
}
