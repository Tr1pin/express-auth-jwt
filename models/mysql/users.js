import mysql from 'mysql2/promise'
import { DEFAULT_CONFIG_MySQL, SALT_ROUNDS } from '../../config.js'
import bcrypt from 'bcryptjs'


const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG_MySQL
const connection = await mysql.createConnection(connectionString)  

export class UserModel {
    static async connect () {
      const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG_MySQL
      const connection = await mysql.createConnection(connectionString)  

      return connection
    }
    
    static async getUserByEmail ({ email }) {
        if (email) {
            
            try{
              const users = await connection.query(
                `SELECT BIN_TO_UUID(id) id, email, password FROM users WHERE email = ?;`,
                [email]
              )

              console.log(users);
              if (users[0].length === 0) return []
        
              return users[0]

            }catch(e){
              throw new Error('The user does not exist')
            }

        }else{
          throw new Error('Email is required')
        }
    }

    static async getById ({ id }) {

      if(!id){
        try {
          const [user] = await connection.query(
            `SELECT *, BIN_TO_UUID(id) id
              FROM users WHERE id = UUID_TO_BIN(?);`,
            [id]
          )
      
          if (user[0].length === 0 || user[0] === null) throw new Error('User not found')
      
          return user[0];
        } catch (error) {
          throw new Error('Error getting user')
        }
      }else{
        throw new Error('Id is required')
      }
    }

    static async create ({ input }) {
        const {
            username,
            email,
            password
        } = input
    
        // todo: crear la conexión de genre
    
        // crypto.randomUUID()
        const [uuidResult] = await connection.query('SELECT UUID() uuid;')
        const [{ uuid }] = uuidResult

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
        
        const role = 'user'
        try {
          await connection.query(
            `INSERT INTO users (id, username, email, password, role)
              VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?);`,
            [username, email, passwordHash, role]
          )
        } catch (e) {
          // puede enviarle información sensible
          return "Error creating user"
          // enviar la traza a un servicio interno
          // sendLog(e)
        }
    
        const [users] = await connection.query(
          `SELECT username, email, role, BIN_TO_UUID(id) id
            FROM users WHERE id = UUID_TO_BIN(?);`,
          [uuid]
        )
    
        return users[0]
    }

    static async delete ({ id }) {

        try{
          const user = await connection.query(
            `SELECT email, BIN_TO_UUID(id) id
              FROM users WHERE id = UUID_TO_BIN(?);`,
            [id]
        )
        }catch(e){
          return [false, null]

        }
        
        await connection.query(
            `DELETE FROM users WHERE id = UUID_TO_BIN(?);`,
            [id]
        )

        return [true, user[0]]
    }
    
    static async update ({ id, input }) {
        const {
            username,
            email,
            password
        } = input

        const user = await connection.query(
            `SELECT email, BIN_TO_UUID(id) id
              FROM users WHERE id = UUID_TO_BIN(?);`,
            [id]
        )

        if (!user || user.length === 0) return null;

        // Construir dinámicamente la consulta UPDATE solo con los valores definidos
        const fields = [];
        const values = [];
    
        if (username !== undefined) {
            fields.push("username = ?");
            values.push(username);
        }
        if (email !== undefined) {
            fields.push("email = ?");
            values.push(email);
        }
        if (password !== undefined) {
            fields.push("password = ?");
            values.push(password);
        }
    
        if (fields.length > 0) {
            values.push(id);
            const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = UUID_TO_BIN(?);`;
            try {
              await connection.query(sql, values);  
            } catch (error) {
              error.message = 'Error updating user'
            }
            
        }

        const [users] = await connection.query(
            `SELECT username, email, role, BIN_TO_UUID(id) id
              FROM users WHERE id = UUID_TO_BIN(?);`,
            [id]
        )

        return users[0]
    }
}