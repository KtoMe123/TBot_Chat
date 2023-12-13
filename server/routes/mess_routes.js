import Router from 'express'
const router = new Router()

import mesController from '../controller/mess_controller.js'

router.get('/mess/:id_chat', mesController.getOneMes)
router.get('/bot-mess/:token', mesController.getBotMes)
router.get('/mess', mesController.getMes)
router.post('/mess', mesController.CreateMes)
router.delete('/mess/:id_chat', mesController.DeleteMess)
router.put('/mess/:id_chat', mesController.ViewMess)

export default router