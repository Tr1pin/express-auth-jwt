import { UserModel } from '../../models/mysql/users.js'

export class UserAuthController extends UserModel {
    constructor({ authModel, userModel }) {
        super(userModel);
        this.authModel = authModel;
    }

    login = async (req, res) => { 
        const { email, password } = req.body
        try {
            const user = await this.authModel.login({ email, password })
            const token = jwt.sign(
                { id: user.id, username: user.username },
                SECRET_KEY,
                { expiresIn: '1h' }
            );
            res.cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000,
            }).send({ user, token });
        } catch (error) {
            res.status(400).send(error.message)
        }
    
    }

    register = async (req, res) => {
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

    logout = async (req, res) => {
        res.clearCookie('access_token')
    }
    
    protected = (req, res) => {
        const { user } = req.session;
        if (!user) return res.status(403).send('Access not authorized')
        res.render('protected', user)
    }

    home = () => {
        res.render('index')
    }

}