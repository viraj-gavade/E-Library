class customApiResponse {
    constructor(statusCode , message ='Success', data ){
        this.statusCode = statusCode,
        this.message = message ,
        this.data = data
    }
}


module.exports = customApiResponse