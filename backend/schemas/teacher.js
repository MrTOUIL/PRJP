const mongoose = require('mongoose') ;

const shm = new mongoose.Schema({
    first_name:{type:String},
    last_name:{type:String},
    email:{type:String , unique:true},
    phone:{type:String , unique:true},
    postal_adress:{type:String},
    password:{type:String},
    role:{type:String},
    subject:[{type:String}],
    school_levels_taught:[{type:String}],
    mode:{type:String},
    available_days:[{type:String}],
    start_time:{type:String},
    end_time:{type:String},
    home_visits:{type:Boolean},
    bio:{type:String},
    status:{type:String},
    rating:{type:Number}    
}) ;  

module.exports = mongoose.model("teachers",shm) ;