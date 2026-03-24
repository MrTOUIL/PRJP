const mongoose = require('mongoose') ; 

const shm = new mongoose.Schema({
    email:{type:String},
    code:{type:Number},
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600   // 600 seconds = 10 minutes
    }
}) ;

module.exports = mongoose.model("resetpasswords",shm) ; 