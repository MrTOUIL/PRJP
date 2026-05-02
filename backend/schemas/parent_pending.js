//the pending_student schema and model!
const mongoose = require('mongoose'); 

const shm = new mongoose.Schema({
    first_name:{type:String},
    last_name:{type:String},
    parentf:{type:String},
    parentl:{type:String},
    email:{type:String , unique:true},
    phone:{type:String , unique:true},
    postal_adress:{type:String},
    password:{type:String},
    academic_level:{type:String},
    code:{type:Number},
    role:{type:String}
}) ; 

module.exports = mongoose.model("parent_pendings",shm) ; 