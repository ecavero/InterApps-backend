import {Request, Response} from 'express'
import {validationResult} from 'express-validator'
import User from "../models/User.ts"
import { checkPassword, hashPassword } from '../utils/auth.ts'
import slug from 'slug'
import { generateJWT } from '../utils/jwt.ts'

export const createAccount = async(req: Request, res: Response)=>{



    const {email, password, handle} = req.body

    const userExists = await User.findOne({email}) //findOne es como un where en bd relacionales

    if(userExists){
        const error = new Error('El usuario ya está registrado')
        return res.status(409).json({error: error.message})
    }

    //Otra forma de agregar datos / instanciar el modelo User:
    const user = new User(req.body)
    user.password = await hashPassword(password)

    console.log(slug(handle, {replacement: ''}))
    
    //Hash contraseñas:
    //const hash = await hashPassword(password)
    //console.log(hash)
    //

    await user.save()

    res.status(201).send('Registro creado correctamente')
}

export const login = async (req: Request, res: Response) => {
    //Manejar errores
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error: errors.array()})
    }

    const {email, password} = req.body

    const user = await User.findOne({email})

    if(!user){
        const error = new Error('El usuario no existe')
        return res.status(404).json({error: error.message})
    }
    
    //Comprobar el password
    //console.log(user.password)
    //checkPassword(password, user.password)

    const isPasswordCorrect = await checkPassword(password, user.password)

    if(!isPasswordCorrect){
        const error = new Error('Password incorrecto')
        return res.status(401).json({error: error.message})
        //401: porque no está autorizado a acceder al recurso
    }
    
    //res.send('Autenticado...')

    //Hasta aquí tenemos un usuario que ingresó correctamente, entonces:
    const token = generateJWT({id: user._id})
    res.send(token)

}
