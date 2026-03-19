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

const dns = require('dns');
dns.setServers(['1.1.1.1', '1.0.0.1']);

async function run() {
    try{
       await mongoose.connect(`mongodb+srv://PRJP:${process.env.DB_PW}@prjp.do0q945.mongodb.net/alemni-app`);
       console.log("Connected to mongo Atlas✅") ;
       
       app.get('/',(req,res) => {
        res.send("Welcome to Alemni API") ; 
       }) ;

       app.use('/logs',require('./authServer')) ;
       app.use('/service',require('./serviceServer')) ; 

       const options = {
        key:fs.readFileSync("server.key"),
        cert:fs.readFileSync("server.cert")
       }

       https.createServer(options,app).listen(5000,() => {
        console.log("Server running on https://localhost:5000") ; 
       })
    }catch(e){
       console.log("Error in main server!")
       console.error(e);
    }
    
}

run(); 