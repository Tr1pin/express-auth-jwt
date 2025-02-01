import { UserModel } from "../mysql/users.js";
import bcrypt from 'bcryptjs'

export class AuthModel {
    static async login ({ email, password }) {
        if (email) {
           
            const users = await UserModel.getUserByEmail({ email })
            console.log(users);
            if(!users) throw new Error ('The user does not exist');

            try {
                const user = users[0]
                if(bcrypt.compare(password, user.password)){
                    return user
                }
                
            } catch (error) {
                throw new Error('Invalid password');
            }
            
        }
    }
}