export const {
  DEFAULT_PORT = 8080,
  SALT_ROUNDS = 10,
  SECRET_KEY = 'this-is-a-secret-key-that-should-be-changed',
  DEFAULT_CONFIG_MySQL = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'Denis.,214',
    database: 'db'
  }
} = process.env