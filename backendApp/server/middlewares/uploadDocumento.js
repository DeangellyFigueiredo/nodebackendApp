const multer = require('multer')

module.exports = (multer({
    storage : multer.diskStorage({
        destination: (req,file,cb) =>{
            cb(null,'server/public/upload/planilhas')
        },
        filename: (req,file,cb)=>{
            cb(null,Date.now() + "_" + file.originalname)
        }
    }),
    fileFilter: (req,file,cb) =>{
        const extensaoCSV = ['text/CSV','text/csv'].find
        (formatoAceito => formatoAceito == file.mimetype)
        
        if(extensaoCSV){
            return cb(null,true);
        }else
        return cb(null,false);
    }
})


)