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
  async getOneBotToken(req, res) {
    const token = req.params.token
    const tokenBot = await db.query('SELECT * FROM bot where token = $1', [token])
    res.json(tokenBot.rows)
  }
  async BotSocketUpdate(req, res) {
    const {server} = req.body
    const mess = await db.query('UPDATE bot SET server = $1 RETURNING *', [server])
    res.json(mess.rows)
  }
  async BotSocketMainUpdate(req, res) {
    const {socket_main, token} = req.body
    const mess = await db.query('UPDATE bot SET socket_main = $1 where token = $2 RETURNING *', [socket_main, token])
    res.json(mess.rows)
  }
  async BotSocketListUpdate(req, res) {
    const {socket_list, token} = req.body
    const mess = await db.query('UPDATE bot SET socket_list = $1 where token = $2 RETURNING *', [socket_list, token])
    res.json(mess.rows)
  }


  async CreateBot(req, res) {
    const {mail, pass, token, server, socket_chat, socket_list, socket_main}= req.body
    const NewMes = await db.query('INSERT INTO bot (mail, pass, token, server, socket_chat, socket_list, socket_main) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [mail, pass, token, server, socket_chat, socket_list, socket_main])
    res.json(NewMes)
  }
  async DeleteBot(req, res) {
    const mail = req.params.mail
    const DelBot = await db.query('DELETE FROM bot where mail = $1', [mail])
    res.json(DelBot.rows[0])
  }

}

export default new botController()