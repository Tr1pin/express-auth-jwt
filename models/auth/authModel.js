import { UserModel } from "../mysql/users.js";
import bcrypt from 'bcryptjs'

export class AuthModel extends UserModel {
    constructor ({ userModel }) {
        this.userModel = userModel
    }

    static async login ({ email, password }) {
        if (email) {
            try{
                const users = await this.userModel.getUserByEmail({ email })
            }catch(e){
                return 'User not found'
            }

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