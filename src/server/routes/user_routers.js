import Router from 'express'
const router = new Router()

import UserController from '../controller/user_controller.js'

router.get('/users/:id_chat', UserController.getOneUser)
router.get('/users', UserController.getUsers)
router.post('/users', UserController.CreateUser)
router.delete('/users/:id_chat', UserController.DeleteUser)
router.put('/users/:id_chat', UserController.UpdateCount)

export default router