import Router from 'express'
const router = new Router()

import UserController from '../controller/user_controller.js'


router.get('/users', UserController.getUsers)
router.get('/bot-users/:token', UserController.getBotUser)
router.get('/user/:id_chat&:token', UserController.getUser)
router.get('/users/:id_chat', UserController.getOneUser)


router.post('/users', UserController.CreateUser)
router.delete('/users/:id_chat', UserController.DeleteUser)
router.put('/users_count', UserController.UpdateCount)

export default router