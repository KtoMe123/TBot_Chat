import Router from 'express'
const router = new Router()

import BotController from '../controller/bot_controller.js'

router.get('/bot/:mail', BotController.getOneBot)
router.get('/bots/:token', BotController.getOneBotToken)
router.get('/bot', BotController.getBot)
router.post('/bot', BotController.CreateBot)
router.delete('/bot/:mail', BotController.DeleteBot)
router.put('/bot', BotController.BotSocketUpdate)
router.put('/bot_update_main', BotController.BotSocketMainUpdate)
router.put('/bot_update_list', BotController.BotSocketListUpdate)

export default router