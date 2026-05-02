const mongoose = require("mongoose") ;

const shm = new mongoose.Schema({
   //title:{type:String , required:true}, 
   Date:{type:String , required:true , unique:false},
   start_time:{type:String , required:true},
   end_time:{type:String , required:true},
   //mode:{type:String , required:true},
   location:{type:String , required:true , unique:false},
   status:{type:String , required:true},
   service:{type:mongoose.Schema.Types.ObjectId , ref:"services"},
   done_by:{type:mongoose.Schema.Types.ObjectId , ref:"teachers"}
}) ;

module.exports = mongoose.model("sessions",shm) ;