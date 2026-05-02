const mongoose = require('mongoose') ; 

const Schema = new mongoose.Schema({
    first_name:{type:String},
    last_name:{type:String},
    email:{type:String , unique:true},
    phone:{type:String , unique:true},
    postal_adress:{type:String},
    password:{type:String},
    academic_level:{type:String},
    role:{type:String},
}) ;  

module.exports = mongoose.models.students || mongoose.model("students", Schema) ;
//why we added this : 
//this is to prevent the "OverwriteModelError: Cannot overwrite `students` model once compiled." error that occurs when we import this model in multiple files (like teacherServer.js and authServer.js) because mongoose tries to compile the model multiple times. By checking if the model already exists in mongoose.models, we can avoid this error and reuse the existing model instead of trying to compile it again.