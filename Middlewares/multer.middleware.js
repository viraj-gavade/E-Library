const multer = require('multer')

/**
 * Multer disk storage configuration
 * Specifies how and where uploaded files should be stored
 * 
 * Storage configuration:
 * - Destination: ./public/temp directory
 * - Filename: Preserves original filename
 * 
 * @type {multer.DiskStorageOptions}
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')  // Temporary storage location
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)  // Keep original filename
    }
  })
  
/**
 * Multer upload middleware configuration
 * 
 * Configuration options:
 * - Storage: Uses disk storage configuration defined above
 * - File size limit: 20MB (20 * 1024 * 1024 bytes)
 * 
 * Usage:
 * - Single file: upload.single('fieldName')
 * - Multiple files: upload.array('fieldName', maxCount)
 * - Mixed files: upload.fields([{ name: 'fieldName', maxCount: 1 }])
 * 
 * Error handling:
 * - Automatically handles file size exceeding limit
 * - Handles invalid file types if fileFilter is configured
 * 
 * @type {multer.Instance}
 */
const upload = multer({ 
    storage: storage,
    limits: {
      fileSize: 20 * 1024 * 1024 // Set file size limit to 20MB (20 * 1024 * 1024 bytes)
    }
  })

module.exports = upload