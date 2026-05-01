//server.js
/*require('dotenv').config() ;
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
app.use(cors({
  origin: "http://localhost:8081",  // your frontend origin
  credentials: true,                // allow cookies
})); 
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

run(); */


// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dns = require('dns');
const { protect , authorize } = require('./middleware') ;
app.use(express.json());

app.use(cors({
  origin: "*",   // or set your IP if you want stricter control
  credentials: true,
}));

app.use(mongoSanitize());
app.use(cookieParser());

// DNS fix (good)
dns.setServers(['1.1.1.1', '1.0.0.1']);

async function run() {
  try {
    await mongoose.connect(
      `mongodb+srv://PRJP:${process.env.DB_PW}@prjp.do0q945.mongodb.net/alemni-app`
    );

    console.log("Connected to mongo Atlas✅");

    app.get('/', (req, res) => {
      res.send("Welcome to Alemni API");
    });

    //this route will check the accessToken sent in the header , if valid the app will take the user to its account page (teacher or student or parent or admin)
    app.get("/switchAccount" , protect , async(req,res) => {
       try{
           //if all is right , let's check the role (token decoding already done in middleware)
           const role = req.user.role ; 
           res.json({ succ:"Token is valid!" , role}) ; 
       }catch(err){
         console.log(err) ;
         res.status(500).json({ error: "Something went wrong" }); 
       }
    })  ;

    app.use('/logs', require('./authServer'));
    app.use('/document', require('./DocumentServer'));
    app.use('/teacher', require('./teacherServer'));
    //app.use('/service', require('./serviceServer'));
    app.use('/api/admin', require('./admingame'));
    app.use('/student', require('./studentServer'));
    

    // ✅ HTTP SERVER (NO HTTPS)
    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });

  } catch (e) {
    console.log("Error in main server!");
    console.error(e);
  }
}

run();