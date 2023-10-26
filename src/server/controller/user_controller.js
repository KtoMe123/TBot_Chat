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
  // async ViewMessage(req, res) {
  //   const {seen, u_to, u_from} = req.body
  //   const mess = await db.query('UPDATE mess SET seen = $1 where u_to = $2 AND u_from = $3 RETURNING *', [seen, u_to, u_from])
  //   res.json(mess.rows)
  // }
  async UpdateCount(req, res) {
    const {count, id_chat} = req.body
    const MyCount = await db.query('UPDATE users SET count = $1 where id_chat = $2 RETURNING *', [count, id_chat])
    res.json(MyCount.rows)
  }
  async CreateUser(req, res) {
    const {id_chat, username, link, count}= req.body
    const NewMes = await db.query('INSERT INTO users (id_chat, username, link, count) values ($1, $2, $3, $4) RETURNING *', [id_chat, username, link, count])
    res.json(NewMes)
  }
  async DeleteUser(req, res) {
    const id_chat = req.params.id_chat
    const DelMess = await db.query('DELETE FROM users where id_chat = $1', [id_chat])
    res.json(DelMess.rows[0])
  }

}

export default new userController()