const mongoose = require("mongoose") ;

const shm = new mongoose.Schema({
    matiere:{type:String , required:true},
    niveau:{type:String , required:true},
    objectif:{type:String , required:true},
    frequence:{type:String , required:true},
    duree:{type:String , required:true},
    price:{type:Number , required:true},
    mode:{type:String , required:true},
    status:{type:String , required:true},
    requester:{type:mongoose.Schema.Types.ObjectId , ref:"students"},
    res_by:{type:mongoose.Schema.Types.ObjectId , ref:"teachers"},
}) ;

module.exports = mongoose.model("request_students",shm) ;