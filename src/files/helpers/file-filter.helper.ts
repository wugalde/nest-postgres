export const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: Function) => {
   
   if(!file) 
        return cb(new Error('No se envio el archivo'), false)

   const type = file.mimetype.split('/')[1];
   const types = ['jpg', 'png', 'gif', 'jpng'];
   if(!types.includes(type))
        return cb(new Error(`El tipo de imagen no es permitido ${file.mimetype}`), false);
    
    cb( null, true)
}