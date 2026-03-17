//server.js
require('dotenv').config() ;
const express = require('express') ; 
const app = express() ; 
const mongoose = require('mongoose') ; 
const mongoSanitize = require('express-mongo-sanitize') ; 
const { body , validationResult } = require('express-validator') ;
const cors = require('cors') ; 
const https = require('https') ; 
const fs = require('fs') ; 
const cookieParser = require('cookie-parser') ;
const  jwt = require('jsonwebtoken') ; 
app.use(express.json()) ; 
app.use(cors()) ; 
app.use(mongoSanitize()) ;
app.use(cookieParser()) ;
async function run() {
    try{
       await mongoose.connect("mongodb://127.0.0.1:27017/alemni_app");
       console.log("Connected ✅") ;
       
       app.get('/',(req,res) => {
        res.send("Welcome to Alemni API") ; 
       }) ;

       app.use('/logs',require('./authServer')) ;

       app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
          });
    }catch(e){
       console.log("Error in main server!")
       console.error(e);
    }
    
}

run(); 