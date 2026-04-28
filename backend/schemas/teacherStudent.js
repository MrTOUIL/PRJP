const mongoose = require('mongoose') ; 

const shm = new mongoose.Schema({
    teacher:{type:mongoose.Schema.Types.ObjectId , ref:"teachers"} , 
    student:{type:mongoose.Schema.Types.ObjectId , ref:"students"} , 
    service:{type:mongoose.Schema.Types.ObjectId , ref:"services"}
}) ; 

module.exports = mongoose.model("teacherStudents",shm) ; 