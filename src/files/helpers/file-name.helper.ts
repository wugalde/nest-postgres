import {v4 as uuid} from 'uuid'

export const fileName = (req: Express.Request, file: Express.Multer.File, cb: Function) => {
   
   if(!file) 
        return cb(new Error('No se envio el archivo'), false)

   const type = file.mimetype.split('/')[1];
   const date = new Date().getTime()
   const name = `${uuid()}.${type}`
    
    cb( null, name)
}