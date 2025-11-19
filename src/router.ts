import {Router} from 'express'
import {body} from 'express-validator' //body permite validar el req.body
import { createAccount, login, getUser } from './handlers/index.ts'
import { handleInputErrors } from './middleware/validation.ts'

//Permite configurar un objeto con todas las rutas que después podemos agregar a la app principal server.ts

const router = Router()

/* Autenticación y Registro*/
router.post('/auth/register', 
    
    body('handle').notEmpty().withMessage('El handle no puede ir vacío'),
    body('name').notEmpty().withMessage('El nombre no puede ir vacío'),
    body('email').isEmail().withMessage('Email no válido'),
    body('password').isLength({min: 8}).withMessage('El password es muy corto, mínimo 8 caracteres'),
    handleInputErrors,
    createAccount)

router.post('/auth/login', 
    
    body('email').isEmail().withMessage('Email no válido'),
    body('password').notEmpty().withMessage('El password es muy corto, mínimo 8 caracteres'),

    login)

router.get('/user', getUser)

export default router
