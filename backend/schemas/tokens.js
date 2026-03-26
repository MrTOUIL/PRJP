/*const mongoose = require('mongoose') ; 

const shm = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId , ref:"User" , required:true},
    token:{type:String , required:true},
    
}) ; 

module.exports = mongoose.model("tokens",shm);*/

const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7 * 24 * 60 * 60 // 7days (auto delete)
  }
});

module.exports = mongoose.model("tokens", tokenSchema);