const mongoose = require('mongoose') ; 

const shm = new mongoose.Schema({
    title:{type:String , required:true} ,
    type_doc:{type:String , required:true} , 
    url:{type:String , required:true} , 
    fileId:{type:String , required:true} , 
    date:{type:String , required:true} , 
    session:{type:mongoose.Schema.Types.ObjectId , ref:"sessions"} , 
    done_by:{type:mongoose.Schema.Types.ObjectId , ref:"teachers"} 
}) ;

module.exports = mongoose.model("documents",shm) ;