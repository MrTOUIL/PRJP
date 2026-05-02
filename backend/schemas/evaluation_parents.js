const mongoose = require("mongoose") ;

const shm = new mongoose.Schema({
    note:{type:Number , required:true},
    comment:{type:String , required:true},
    date:{type:String , required:true},
    evaluator:{type:mongoose.Schema.Types.ObjectId , ref:"parents"},
    evaluated:{type:mongoose.Schema.Types.ObjectId , ref:"teachers"}
});

module.exports = mongoose.model("evaluation_parents",shm) ;