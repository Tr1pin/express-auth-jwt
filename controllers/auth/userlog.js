import { UserModel } from '../../models/mysql/users.js'
import { validateUser } from '../../schemas/users.js'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../../config.js'


export class UserAuthController {
    constructor({ authModel }) {
        this.authModel = authModel;
    }

    login = async (req, res) => { 
        console.log(req.body);
        console.log("login");
        const { email, password } = req.body
        try {
            const user = await this.authModel.login({ email, password })
            console.log( user);
            const token = jwt.sign(
                { id: user.id, email: user.email },
                SECRET_KEY,
                { expiresIn: '1h' }
            );
            res.cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000,
            }).send({ user, token }).status(200)
        } catch (error) {
            res.status(400).send(error.message)
        }
    
    }

    register = async (req, res) => {
            const result = validateUser(req.body)
        
            console.log(result);
            try {
                if (!result.success) {
                    // 422 Unprocessable Entity
                    return res.status(400).json({ error: JSON.parse(result.error.message) })
                }
          
                const newUser = await UserModel.create({ input: result.data })
                
                if (!newUser) {
                    // 422 Unprocessable Entity
                    return res.status(400).json({ error: JSON.parse(result.error.message) })
                }
                res.status(201).json(newUser)   
            } catch (error) {
                res.status(400).send(error.message)
            }
    }

    logout = async (req, res) => {
        res.clearCookie('access_token')
        res.redirect('/')
    }
    
    protected = (req, res) => {
        const { user } = req.session;
        if (!user) return res.status(403).send('Access not authorized')
        res.render('protected', user)
    }

    home = (req, res) => {
        const { user } = req.session;
        res.render('index', user)
    }

}