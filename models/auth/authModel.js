import { UserModel } from "../mysql/users.js";
import bcrypt from 'bcryptjs'

export class AuthModel {
    static async login ({ email, password }) {
        if (email) {
           
            const users = await UserModel.getUserByEmail({ email })
            console.log(users);
            if(!users) return 'User not found'

            try {
                const user = users[0]
                if(bcrypt.compare(password, user.password)){
                    return user
                }
                
            } catch (error) {
                return 'Password incorrect'
            }
            
        }
    }
}