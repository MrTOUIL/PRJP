const mongoose = require('mongoose') ; 

const shm = new mongoose.Schema({
    teacher:{type:mongoose.Schema.Types.ObjectId , ref:"teachers"} , 
    parent:{type:mongoose.Schema.Types.ObjectId , ref:"parents"} , 
    service:{type:mongoose.Schema.Types.ObjectId , ref:"services"}
}) ; 

module.exports = mongoose.model("teacherParents",shm) ; 