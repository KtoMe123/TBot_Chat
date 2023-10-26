import db from '../data_base.js'

class mesController {
  async getMes(req, res) {
    const mess = await db.query('SELECT * FROM mess')
    res.json(mess.rows)
  }
  async getOneMes(req, res) {
    const id_chat = req.params.id_chat
    const mess = await db.query('SELECT * FROM mess where id_chat = $1', [id_chat])
    res.json(mess.rows)
  }
  async ViewMess(req, res) {
    const {seen, id_chat} = req.body
    const mess = await db.query('UPDATE mess SET seen = $1 where id_chat = $2 RETURNING *', [seen, id_chat])
    res.json(mess.rows)
  }

  async CreateMes(req, res) {
    const {id_chat, main, seen}= req.body
    const NewMes = await db.query('INSERT INTO mess (id_chat, main, seen) values ($1, $2, $3) RETURNING *', [id_chat, main, seen])
    res.json(NewMes)
  }
  async DeleteMess(req, res) {
    const id_chat = req.params.id_chat
    const DelMess = await db.query('DELETE FROM mess where id_chat = $1', [id_chat])
    res.json(DelMess.rows[0])
  }

}

export default new mesController()