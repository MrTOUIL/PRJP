const mongoose = require('mongoose') ; 

const Schema = new mongoose.Schema({   //La plupart est obligatoire 
    first_name:{type:String , required:true},
    last_name:{type:String , required:true},
    email:{type:String , unique:true , required:true},
    phone:{type:String , unique:true , required:true},
    password:{type:String , required:true},
    nb_supp:{type:Number, default:0}, // le nombre ta3 les comptes supprimes par l'admin
    nim:{type:Number , unique:true , required:true} ,// le numero ta3 carte nationale
    isActive : { type: Boolean, default: true },   //online
    lastLogin : { type: Date },   //kima f sinf
    loginAttempts : { type: Number, default: 0 }  //en cas ou
}) ; 

module.exports = mongoose.model("admins",Schema) ; 