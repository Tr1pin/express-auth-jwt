import mysql from 'mysql2/promise'
import { DEFAULT_CONFIG_MySQL, SALT_ROUNDS } from '../../config.js'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG_MySQL

const connection = await mysql.createConnection(connectionString)

export class UserModel {
  
    static async getByRole ({ role }) {

        if (role) {
            const lowerCaseRole = role.toLowerCase()
            
            try{
              const users = await connection.query(
                `SELECT BIN_TO_UUID(id) id, username FROM users WHERE LOWER(role) = ?;`,
                [lowerCaseRole]
              )

              if (users[0].length === 0) return []
        
              return users[0]

            }catch(e){
              return 'Error connection' 
            }

        }
    }

    static async getById ({ id }) {
 
        const [user] = await connection.query(
          `SELECT *, BIN_TO_UUID(id) id
            FROM users WHERE id = UUID_TO_BIN(?);`,
          [id]
        )
    
        if (user[0].length === 0 || user[0] === null) return null
    
        return user[0];
    }

    static async create ({ input }) {
        const {
            username,
            email,
            password,
            role
        } = input
    
        // todo: crear la conexión de genre
    
        // crypto.randomUUID()
        const [uuidResult] = await connection.query('SELECT UUID() uuid;')
        const [{ uuid }] = uuidResult

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    
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