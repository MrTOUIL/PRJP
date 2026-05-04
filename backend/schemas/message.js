const mongoose = require('mongoose');

const shm = new mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId , refPath:"actors"},
    receiver:{type:mongoose.Schema.Types.ObjectId , refPath:"actors"},
    msg:{type:String , required:true},
    actors:{type:String , required:true , enum:["parents","teachers","students"]},
}) ; 

module.exports = mongoose.model("messages",shm) ; 