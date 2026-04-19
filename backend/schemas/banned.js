
const mongoose = require('mongoose'); 

const shm = new mongoose.Schema({
    first_name:{type:String},
    last_name:{type:String},
    email:{type:String , unique:true},
    phone:{type:String , unique:true},
}) ; 

module.exports = mongoose.model("banned",shm) ; 