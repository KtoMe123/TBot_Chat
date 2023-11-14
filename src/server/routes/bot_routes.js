import Router from 'express'
const router = new Router()

import BotController from '../controller/bot_controller.js'

router.get('/bot/:mail', BotController.getOneBot)
router.get('/bot', BotController.getBot)
router.post('/bot', BotController.CreateBot)
// router.delete('/bot/:id_chat', UserController.DeleteUser)
// router.put('/bot/:id_chat', UserController.UpdateCount)

export default router