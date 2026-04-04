const mongoose = require('mongoose') ; 

const shm = new mongoose.Schema({
    title:{type:String , required:true},
    type:{type:String , required:true},
    target_audiance:{type:String , required:true},
    mode:{type:String , required:true},
    //expectations:{type:String},
    //duration:{type:String , required:true},
    cost:{type:Number, required:true},
    comment:{type:String},//additional comment for the service
    done_by:{type:mongoose.Schema.Types.ObjectId , ref:"teachers"}//refrencing to the prof that created this service
});
module.exports = mongoose.model("services",shm);