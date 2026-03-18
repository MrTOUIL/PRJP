//authServer.js
//this server handle the registration and signin routes!
require('dotenv').config(); 
const express = require('express');  
const router = express.Router();  
const { body , validationResult } = require('express-validator');
const  jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const students = require('./schemas/student');
const student_pendings = require('./schemas/student_pending');
const parents = require('./schemas/parent'); 
const parent_pendings = require('./schemas/parent_pending');
const teachers = require('./schemas/teacher');
const teacher_pendings = require('./schemas/teacher_pending');
const admins = require('./schemas/admin') ;

const tokens = require('./schemas/tokens') ; 
  
const nodemailer = require('nodemailer') ; 

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
});

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000);
}


function checkNumber(number){

    if(!/^(05|06|07)[0-9]{8}$/.test(number)){
        return false
    }

    return true
}

//==========Registration for student==========//
router.post('/register_student',
    body("first_name").trim().isLength({min:3}),//checks if length of first name is at least 3 chars
    body("last_name").trim().isLength({min:2}),//checks if length of last  name is at least 2 chars
    body("phone").custom(value => {
   if(!checkNumber(value)){
       throw new Error("Invalid phone number") ; 
   }
   return true
}),//checks if the number is valid(a real algerian number)
    body("email").isEmail().normalizeEmail().trim(),//verify the validity of the email
    body("password").isString().isLength({min:8}).trim()//checks the password validity
    ,async(req,res) => {

    const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const {first_name,last_name,email,phone,postal_adress,password,academic_level} = req.body ; 
        //verify if there is not an account with the same info 
        const st1 = await students.findOne({email:email}) ; 
        const st2 = await students.findOne({phone:phone}) ; 
        if (st1 || st2){
            return res.json({message:"account with same info exist!"}) ; 
        }
        //after the info are verified , we sent the email
        const code = generateCode() ;
        const info = await transporter.sendMail({
           from: `<${process.env.MAIL_USER}>`,
           to: email,
           subject: "Verify your mail!",
           html: `<p>This is the code of your account to verify with : ${code} </p>`,
        }) ;
        //now we store in pending !
        const hashedpassword = await bcrypt.hash(password,14) ; 

        await student_pendings.create({
          first_name:first_name , 
          last_name:last_name ,
          email:email,
          phone:phone,
          postal_adress:postal_adress,
          password:hashedpassword,
          academic_level:academic_level,
          code:code,
          role:"student" 
        }) ;
        res.json({succ:"email sent!"}) ; 
    }catch(e){
        res.json({error:"invalid credentials"}) ;
    }
}) ; 

//==========Parent registration==========//
router.post('/register_parent',
    body("first_name").trim().isLength({min:3}),//checks if length of first name is at least 3 chars
    body("last_name").trim().isLength({min:2}),//checks if length of last  name is at least 2 chars
    body("phone").custom(value => {
   if(!checkNumber(value)){
       throw new Error("Invalid phone number")
   }
   return true
}),//checks if the number is valid(a real algerian number)
    body("email").isEmail().normalizeEmail().trim(),//verify the validity of the email
    body("password").isString().isLength({min:8}).trim()//checks the password validity
    ,async(req,res) => {

    const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const {first_name,last_name,email,phone,postal_adress,password,academic_level} = req.body ; 
        //verify if there is not an account with the same info 
        const st1 = await parents.findOne({email:email}) ; 
        const st2 = await parents.findOne({phone:phone}) ; 
        if (st1 || st2){
            return res.json({message:"account with same info exist!"}) ; 
        }
        //after the info are verified , we sent the email
        const code = generateCode() ;
        const info = await transporter.sendMail({
           from: `<${process.env.MAIL_USER}>`,
           to: email,
           subject: "Verify your mail!",
           html: `<p>This is the code of your account to verify with : ${code} </p>`,
        }) ;
        //now we store in pending !
        const hashedpassword = await bcrypt.hash(password,14) ; 

        await parent_pendings.create({
          first_name:first_name , 
          last_name:last_name ,
          email:email,
          phone:phone,
          postal_adress:postal_adress,
          password:hashedpassword,
          academic_level:academic_level,
          code:code,
          role:"parent" 
        }) ;
        res.json({succ:"email sent!"}) ; 
    }catch(e){
        res.json({error:"invalid credentials"}) ;
    }
}) ;

//==========teacher registration==========//
router.post('/register_teacher',
    body("first_name").trim().isLength({min:3}),
    body("last_name").trim().isLength({min:2}),
    body("phone").custom(value => {
       if(!checkNumber(value)){
           throw new Error("Invalid phone number")
       }
       return true
    }),
    body("email").isEmail().normalizeEmail().trim(),
    body("password").isString().isLength({min:8}).trim(),
    async(req,res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try{
        const {first_name,last_name,email,phone,postal_adress,password,subject,school_levels_taught,mode,available_days,start_time,end_time,home_visits,bio} = req.body;

        const t1 = await teachers.findOne({email:email});
        const t2 = await teachers.findOne({phone:phone});
        if (t1 || t2){
            return res.json({message:"account with same info exist!"});
        }

        const code = generateCode();
        await transporter.sendMail({
           from: `<${process.env.MAIL_USER}>`,
           to: email,
           subject: "Verify your mail!",
           html: `<p>This is the code of your account to verify with : ${code} </p>`,
        });

        const hashedpassword = await bcrypt.hash(password,14);

        await teacher_pendings.create({
          first_name, last_name, email, phone, postal_adress, password:hashedpassword,
          subject, school_levels_taught, mode, available_days, start_time, end_time, home_visits, bio,
          code,role:"teacher"
        });

        res.json({succ:"email sent!"});
    }catch(e){
        res.json({error:"invalid credentials"});
    }
});


router.put('/resend_code',
   body("email").isEmail().normalizeEmail().trim()
  ,async(req,res) => {
    const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    
    try{
        const {email} = req.body ;
        const pending_st = await student_pendings.findOne({email:email}) ;
        const pending_tc = await teacher_pendings.findOne({email:email}) ;
        const pending_pr = await parent_pendings.findOne({email:email}) ; 

        const user = pending_pr || pending_st || pending_tc ; 
        if (!user){
          return res.json({error:"invalid mail!"}) ;
        }
        const code = generateCode() ;
        const info = await transporter.sendMail({
         from: `<${process.env.MAIL_USER}>`,
         to: email,
         subject: "Verify your mail!",
         html: `<p>This is the code of your account to verify with : ${code} </p>`,
        });
        //update 
        user.code = code ; 
        await user.save() ;
        res.json({succ:"resent"}) ;
    }catch(e){
        res.json({error:"error!"}) ; 
    }
}) ; 

router.post("/addactor",
   body("email").isEmail().normalizeEmail().trim()
  ,async(req,res) => {
    const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const {email,code} = req.body ; 
        const pending_st = await student_pendings.findOne({email:email}) ;
        const pending_tc = await teacher_pendings.findOne({email:email}) ;
        const pending_pr = await parent_pendings.findOne({email:email}) ; 

        const user = pending_pr || pending_st || pending_tc ; 
        if (!user){
          return res.json({error:"invalid mail!"}) ;
        }
        
        if (user.code !== code){
          return res.json({error:"invalid code!"}) ;
        }
        
        //it is valid , now let's remove the pending and add to real db 
        if (user.role === "student"){
          await students.create({
            first_name:pending_st.first_name , 
            last_name:pending_st.last_name , 
            email:pending_st.email , 
            phone:pending_st.phone , 
            postal_adress:pending_st.postal_adress ,
            password:pending_st.password,
            academic_level:pending_st.academic_level,
            role:"student"
          }) ;
          await student_pendings.deleteOne({email:email}) ;
        }

        if(user.role ==="parent"){
          await parents.create({
            first_name:pending_pr.first_name , 
            last_name:pending_pr.last_name , 
            email:pending_pr.email , 
            phone:pending_pr.phone , 
            postal_adress:pending_pr.postal_adress ,
            password:pending_pr.password,
            academic_level:pending_pr.academic_level,
            role:"parent"
          }) ; 

          await parent_pendings.deleteOne({email:email}) ; 
        }

        if (user.role === "teacher"){
          await teachers.create({
            first_name:pending_tc.first_name, last_name:pending_tc.last_name,
            email:pending_tc.email, phone:pending_tc.phone, postal_adress:pending_tc.postal_adress,
            password:pending_tc.password, subject:pending_tc.subject, school_levels_taught:pending_tc.school_levels_taught,
            mode:pending_tc.mode, available_days:pending_tc.available_days, start_time:pending_tc.start_time,
            end_time:pending_tc.end_time, home_visits:pending_tc.home_visits, bio:pending_tc.bio,
            role:"teacher" , status:"not verified"
        });

        await teacher_pendings.deleteOne({email:email});
        }
        res.json({succ:"register_done!"}) ;
    }catch(e){
        res.json({error:"error!"}) ;
    }
}) ;

//==========handling the signin of students , parents and teachers==========//

function generateAccessToken(user){
  return jwt.sign(
    {
      id:user._id,
      role:user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn:"1h"
    }
  )
}

function generateRefreshToken(user){
  return jwt.sign(
    {
      id:user._id
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn:"7d"
    }
  )
}

router.post("/login",
  body("email").isEmail().normalizeEmail().trim(),
  body("password").isString().trim().isLength({min:8}),
  async(req,res) => {
    const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const {email,password} = req.body ; 
        const user1 = await students.findOne({email:email}) ;
        const user2 = await parents.findOne({email:email}) ; 
        const user3 = await teachers.findOne({email:email}) ; 
        const user4 = await admins.findOne({email:email}) ;  
        if (!user1 && !user2 && !user3 && !user4){
          return res.json({error:"invalid credentials"}) ; 
        }
        if (user1){
          const ismatch = await bcrypt.compare(password,user1.password) ;  
          if (!ismatch){
            return res.json({error:"invalid credentials"})
          }

          //now we can confirm and create the tokens 
          const AccessToken = generateAccessToken(user1) ; 
          const RefreshToken = generateRefreshToken(user1) ; 
          //store the refresh tokens and access tokens 
          //store the refresh tokens inside the database  ,
          await tokens.create({
            userId:user1._id , 
            token:RefreshToken
          }) ; 
          
          res.cookie("AccessToken",AccessToken,{
            httpOnly:true ,
            secure: true , 
            sameSite : "strict" , 
            maxAge:60*60*1000
          }) ;
          res.cookie("RefreshToken",RefreshToken,{
            httpOnly:true,
            secure:true , 
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
          }) ;

          res.json({succ:"login success!" , role:"student"}) ; 
        }

        if (user2){
          const ismatch = await bcrypt.compare(password,user2.password) ; 
          if (!ismatch){
            return res.json({error:"invalid credentials"})
          }

          //now we can confirm and create the tokens 
          const AccessToken = generateAccessToken(user2) ; 
          const RefreshToken = generateRefreshToken(user2) ; 
          //store the refresh tokens and access tokens 
          //store the refresh tokens inside the database  ,
          await tokens.create({
            userId:user2._id , 
            token:RefreshToken
          }) ; 
          
          res.cookie("AccessToken",AccessToken,{
            httpOnly:true ,
            secure: true , 
            sameSite : "strict" , 
            maxAge:60*60*1000
          }) ;
          res.cookie("RefreshToken",RefreshToken,{
            httpOnly:true,
            secure:true , 
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
          }) ;

          res.json({succ:"login success!" , role:"parent"}) ; 
        }if (user3.isBanned) {
             return res.status(403).json({ error: "This account has been banned." });
          }
          

        if (user3){
          const ismatch = await bcrypt.compare(password,user3.password) ; 
          if (!ismatch){
            return res.json({error:"invalid credentials"})
          }

          //now we can confirm and create the tokens 
          const AccessToken = generateAccessToken(user3) ; 
          const RefreshToken = generateRefreshToken(user3) ; 
          //store the refresh tokens and access tokens 
          //store the refresh tokens inside the database,
          await tokens.create({
            userId:user3._id , 
            token:RefreshToken
          }) ; 
          
          res.cookie("AccessToken",AccessToken,{
            httpOnly:true ,
            secure: true , 
            sameSite : "strict" , 
            maxAge:60*60*1000
          }) ;
          res.cookie("RefreshToken",RefreshToken,{
            httpOnly:true,
            secure:true , 
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
          }) ;

          res.json({succ:"login success!" , role:"teacher"}) ; 
        }

        if (user4){
          const ismatch = await bcrypt.compare(password,user4.password) ; 
          if (!ismatch){
            return res.json({error:"invalid credentials"})
          }

          //now we can confirm and create the tokens 
          const AccessToken = generateAccessToken(user4) ; 
          const RefreshToken = generateRefreshToken(user4) ; 
          //store the refresh tokens and access tokens 
          //store the refresh tokens inside the database  ,
          await tokens.create({
            userId:user4._id , 
            token:RefreshToken
          }) ; 
          
          res.cookie("AccessToken",AccessToken,{
            httpOnly:true ,
            secure: true , 
            sameSite : "strict" , 
            maxAge:60*60*1000
          }) ;
          res.cookie("RefreshToken",RefreshToken,{
            httpOnly:true,
            secure:true , 
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
          }) ;

          res.json({succ:"login success!" , role:"admin"}) ;
        }
    }catch(e){
        res.json({error:"login failed!"}) ;
    } 
  }
) ;

//==========handling "forgetpassword" routes==========//
router.post("/forgetpw_mail",
  body("email").isEmail().normalizeEmail().trim()
  ,async(req,res) => {
    const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const {email} = req.body ; 

        const user1 = await students.findOne({email:email}) ;
        const user2 = await parents.findOne({email:email}) ; 
        const user3 = await teachers.findOne({email:email}) ;
        const user4 = await admins.findOne({email:email}) ; 
        const user = user1 || user2 || user3 || user4 ; 
        
        if (!user){
          return res.json({error:"invalid mail!"}) ;
        }

        //after the mail is verified , send the code 
        const code = generateCode() ; 
        const info = await transporter.sendMail({
           from: `<${process.env.MAIL_USER}>`,
           to: email,
           subject: "Verify your mail!",
           html: `<p>This is the code of your account to verify with : ${code} . It will expires in 10 minutes</p>`,
        }) ;

        //save this email and the code somewhere safe 
        res.cookie("email",email,{
          httpOnly:true , 
          secure: true ,
          sameSite:"strict",
          maxAge:10*60*1000//maxAge = 2min  
        }); 
        res.cookie("code",code,{
          httpOnly:true,
          secure:true,
          sameSite:"strict",
          maxAge:10*60*1000//maxAge:2min
        });
        res.json({succ:"succ!"}) ; 

    }catch(e){
        res.json({error:"error!"}) ;
    }
}) ; 

router.put("/resend_code_forgetpw",async(req,res) => {
    //we will change the code , send to mail
  try{

    if (!req.cookies.email){
      return res.json({error:"code and email expires!"}) ;
    }

    const code = generateCode() ; 
    const info = await transporter.sendMail({
      from: `<${process.env.MAIL_USER}>`,
      to: req.cookies.email,
      subject: "Verify your mail!",
      html: `<p>This is the code of your account to verify with : ${code} </p>`,
    }) ;
    //then resave them in cookies 
    res.cookie("code",code,{
      httpOnly:true,
      secure:true,
      sameSite:"strict",
      maxAge:10*60*1000//maxAge:2min
    }) ;
    res.json({succ:"succ!"}) ; 
  }catch(e){
    res.json({error:"error!"}) ; 
  }   
});

router.post("/verify_code_forgetpw",async(req,res) => {
  try{
     if(!req.cookies.code){
      return res.json({error:"code expires!"}) ; 
     } 
    const {code} = req.body ; 
    if (Number(code) !== Number(req.cookies.code)){
      return res.json({error:"invalid code"}) ; 
    }

    //the code is valid!we can remove the code from the cookie
    res.clearCookie("code",{
      httpOnly:true,
      secure:true,
      sameSite:"strict",
    }) ; 
    res.json({succ:"succ!"}) ; 
  }catch(e){
    res.json({error:"error!"}) ;
  }
});

//the route to reset the pw 
router.post("/reset_pw",
  body("newpassword").isString().isLength({min:8}).trim(),
  body("confirmpassword").isString().isLength({min:8}).trim()
  ,async(req,res) => {
    const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        if(!req.cookies.email){
          return res.json({error:"email expires!"}) ; 
        }
        const {newpassword , confirmpassword} = req.body ;
        if (newpassword !== confirmpassword){
          return res.json({error:"no corresponding!"}) ;
        }
        //now we must update with new password!
         //encrypt the pw 
        const cryptedpw = await bcrypt.hash(newpassword,14) ; 
        const email = req.cookies.email ; 
        const user1 = await students.findOne({email:email}) ;
        const user2 = await parents.findOne({email:email}) ; 
        const user3 = await teachers.findOne({email:email}) ;
        const user4 = await admins.findOne({email:email}) ; 
        const user = user1 || user2 || user3 || user4 ;
        
        user.password = cryptedpw ; 
        await user.save() ; 
        //now remove the email from cookies 
        res.clearCookie("email",{
          httpOnly:true,
          secure:true,
          sameSite:"strict"
        }) ;

        res.json({succ:"succ!!"}) ; 
  
    }catch(e){
        res.json({error:"error!"}) ; 
    }
}) ;


module.exports = router ; 