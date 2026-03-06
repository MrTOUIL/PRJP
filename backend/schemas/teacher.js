const mongoose = require('mongoose') ; 

const Schema = new mongoose.Schema({
    identifier: {type:String , unique:true},
    first_name:{type:String},
    last_name:{type:String},
    email:{type:String , unique:true},
    phone:{type:String , unique:true},
    postal_adress:{type:String},
    password:{type:String},
    subject:{type:String},
    school_level_taught:{type:String},
    available_days:[{type:String}],
    start_time:{type:String},
    end_time:{type:String},
    bio:{type:String},
    verified:{type:Boolean},
    table_services:[{type:String}],
    //number of students that the teacher has
    //table of reviews of the teacher
}) ; 

module.exports = mongoose.model("teachers",Schema) ; 