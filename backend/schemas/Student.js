const mongoose = require('mongoose') ; 

const Schema = new mongoose.Schema({
    identifier: {type:String , unique:true},
    first_name:{type:String},
    last_name:{type:String},
    email:{type:String , unique:true},
    phone:{type:String , unique:true},
    postal_adress:{type:String},
    password:{type:String},
    academic_level:{type:String}
}) ; 

module.exports = mongoose.model("students",Schema) ; 