const {v2} = require('cloudinary')
const fs = require('fs')
v2.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRETE_KEY
});


const uploadFile = async (Filepath)=>{
   try {
     if(!Filepath){
         return null
     }
     const response = await v2.uploader.upload(Filepath,{
         resource_type:'raw'
     })
     fs.unlinkSync(Filepath)
     return response
   } catch (error) {
    console.log(error)
    fs.unlinkSync(Filepath)
    return null
   }
}

module.exports = uploadFile