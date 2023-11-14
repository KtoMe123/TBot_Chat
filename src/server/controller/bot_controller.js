import db from '../data_base.js'

class botController {
  async getBot(req, res) {
    const mess = await db.query('SELECT * FROM bot')
    res.json(mess.rows)
  }
  async getOneBot(req, res) {
    const mail = req.params.mail
    const mess = await db.query('SELECT * FROM bot where mail = $1', [mail])
    res.json(mess.rows)
  }
  // async ViewMess(req, res) {
  //   const {seen, id_chat} = req.body
  //   const mess = await db.query('UPDATE mess SET seen = $1 where id_chat = $2 RETURNING *', [seen, id_chat])
  //   res.json(mess.rows)
  // }

  async CreateBot(req, res) {
    const {mail, pass, token}= req.body
    const NewMes = await db.query('INSERT INTO bot (mail, pass, token) values ($1, $2, $3) RETURNING *', [mail, pass, token])
    res.json(NewMes)
  }
  // async DeleteMess(req, res) {
  //   const id_chat = req.params.id_chat
  //   const DelMess = await db.query('DELETE FROM mess where id_chat = $1', [id_chat])
  //   res.json(DelMess.rows[0])
  // }

}

export default new botController()