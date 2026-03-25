const mongoose = require('mongoose') ; 

const shm = new mongoose.Schema({
    type:{type:String , required:true},
    target_audiance:{type:String , required:true},
    mode:{type:String , required:true},
    expectations:{type:String},
    duration:{type:String , required:true},
    cost:{type:Number, required:true},
    source:{type:String , required:true},
    fileId:{type:String , required:true},
    comment:{type:String},
    done_by:{type:mongoose.Schema.Types.ObjectId , ref:"teachers"}//refrencing to the prof that created this service
});

module.exports = mongoose.model("services",shm);