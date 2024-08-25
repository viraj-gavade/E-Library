const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  
  const upload = multer({ storage: storage ,
    limits: {
      fileSize: 20 * 1024 * 1024 // Set file size limit to 20MB (20 * 1024 * 1024 bytes)
    }
  }
  )


  module.exports = upload