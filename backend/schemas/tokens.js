const mongoose = require('mongoose') ; 

const shm = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId , ref:"User" , required:true},
    token:{type:String , required:true},
    /*createdAt: { i will let it as comment for now!!
    type: Date,
    default: Date.now,
    expires: 1800 //approche security bach le token yetfassa apres 30 min w database ma tet3amarch
}*/
}) ; 

module.exports = mongoose.model("tokens",shm);