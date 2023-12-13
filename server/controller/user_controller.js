import db from '../data_base.js'

class userController {
  async getUsers(req, res) {
    const mess = await db.query('SELECT * FROM users')
    res.json(mess.rows)
  }
  async getOneUser(req, res) {
    const id_chat = req.params.id_chat
    const mess = await db.query('SELECT * FROM users where id_chat = $1', [id_chat])
    res.json(mess.rows)
  }
  async getUser(req, res) {
    const id_chat = req.params.id_chat
    const token = req.params.token
    const mess = await db.query('SELECT * FROM users where id_chat = $1 AND token = $2', [id_chat, token])
    res.json(mess.rows)
  }
  async getBotUser(req, res) {
    const token = req.params.token
    const mess = await db.query('SELECT * FROM users where token = $1', [token])
    res.json(mess.rows)
  }
  // async ViewMessage(req, res) {
  //   const {seen, u_to, u_from} = req.body
  //   const mess = await db.query('UPDATE mess SET seen = $1 where u_to = $2 AND u_from = $3 RETURNING *', [seen, u_to, u_from])
  //   res.json(mess.rows)
  // }
  async UpdateCount(req, res) {
    const {count, id_chat, token} = req.body
    const MyCount = await db.query('UPDATE users SET count = $1 where id_chat = $2 AND token = $3 RETURNING *', [count, id_chat, token])
    res.json(MyCount.rows)
  }
  async CreateUser(req, res) {
    const {id_chat, username, link, count, token}= req.body
    const NewMes = await db.query('INSERT INTO users (id_chat, username, link, count, token) values ($1, $2, $3, $4, $5) RETURNING *', [id_chat, username, link, count, token])
    res.json(NewMes)
  }
  async DeleteUser(req, res) {
    const id_chat = req.params.id_chat
    const DelMess = await db.query('DELETE FROM users where id_chat = $1', [id_chat])
    res.json(DelMess.rows[0])
  }

}

export default new userController()