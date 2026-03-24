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
const resetpasswords = require('./schemas/resetpassword') ; 

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
        return res.status(400).json({error:errors.array()})
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
        const m = await student_pendings.findOne({ $or: [{email}, {phone}] });
        if (m) {
          await m.deleteOne();  // good if the user exists the app and do new registration
        }

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
    body("parentf").trim().isLength({min:3}),
    body("parentl").trim().isLength({min:2}),
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
        return res.status(400).json({error:errors.array()})
    }

    try{
        const {first_name,last_name,parentf,parentl,email,phone,postal_adress,password,academic_level} = req.body ; 
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
        const m = await parent_pendings.findOne({ $or: [{email}, {phone}] });
        if (m) {
          await m.deleteOne();  // good if the user exists the app and do new registration
        }
        await parent_pendings.create({
          first_name:first_name , 
          last_name:last_name ,
          parentf,
          parentl,
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
        return res.status(400).json({error:errors.array()});
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
        const m = await teacher_pendings.findOne({ $or: [{email}, {phone}] });
        if (m) {
          await m.deleteOne();  // good if the user exists the app and do new registration
        }
        await teacher_pendings.create({
          first_name, last_name, email, phone, postal_adress, password:hashedpassword,
          subject, school_levels_taught, mode, available_days, start_time, end_time, home_visits, bio,
          code,role:"teacher"
        });

        res.json({succ:"email sent!"});
    }catch(e){
        console.log(e) ; 
        res.json({error:"invalid credentials"});
    }
});


router.put('/resend_code',
   body("email").isEmail().normalizeEmail().trim()
  ,async(req,res) => {
    const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
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
        return res.status(400).json({error:errors.array()})
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
            parentf:pending_pr.parentf,
            parentl:pending_pr.parentl, 
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
        res.json({succ:"register_done!" , id:user._id , role:user.role}) ;
    }catch(e){
        console.log(e) ; 
        res.json({error:"error!"}) ;
    }
}) ;

//==========handling the signin of students , parents and teachers==========//

/*function generateAccessToken(user){
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
}*/

router.post("/login",
  body("email").isEmail().normalizeEmail().trim(),
  body("password").isString().trim().isLength({min:8}),
  async(req,res) => {
    const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
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
          
          res.json({succ:"login success!" , role:"student" , id:user1._id}) ; 
        }

        if (user2){
          const ismatch = await bcrypt.compare(password,user2.password) ; 
          if (!ismatch){
            return res.json({error:"invalid credentials"})
          }


          res.json({succ:"login success!" , role:"parent" , id:user2._id}) ; 
        }


        if (user3){
          const ismatch = await bcrypt.compare(password,user3.password) ; 
          if (!ismatch){
            return res.json({error:"invalid credentials"})
          }

          res.json({succ:"login success!" , role:"teacher" , id:user3._id}) ; 
        }

        if (user4){
          const ismatch = await bcrypt.compare(password,user4.password) ; 
          if (!ismatch){
            return res.json({error:"invalid credentials"})
          }


          res.json({succ:"login success!" , role:"admin" , id:user4._id}) ;
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
        return res.status(400).json({error:errors.array()})
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
        
        const m = await resetpasswords.findOne({email}) ; 
        if (m){ // if user want to do another request 
          await resetpasswords.deleteOne({email}) ; 
        }

        //after the mail is verified , send the code 
        const code = generateCode() ; 
        const info = await transporter.sendMail({
           from: `<${process.env.MAIL_USER}>`,
           to: email,
           subject: "Verify your mail!",
           html: `<p>This is the code of your account to verify with : ${code} . It will expires in 10 minutes</p>`,
        }) ;
        
        await resetpasswords.create({
          email , 
          code 
        }) ; 
        res.json({succ:"succ!" , email}) ; 

    }catch(e){
        res.json({error:"error!"}) ;
    }
}) ;




router.put("/resend_code_forgetpw",async(req,res) => {
    //we will change the code , send to mail
  try{
    const {email} = req.body ; 
    
    const code = generateCode() ; 
    const info = await transporter.sendMail({
      from: `<${process.env.MAIL_USER}>`,
      to: email,
      subject: "Verify your mail!",
      html: `<p>This is the code of your account to verify with : ${code} . It will expires in 10 minutes</p>`,
    }) ;
    const m = await resetpasswords.findOne({email}) ;
    if (m) // if the 10 min still not pass!!
      {await resetpasswords.deleteOne({email}) ;}
    
    await resetpasswords.create({email , code}) ; 

    res.json({succ:"succ!"}) ; 
  }catch(e){
    res.json({error:"error!"}) ; 
  }   
});



router.post("/verify_code_forgetpw",async(req,res) => {
  try{
    const {code} = req.body ;
    const m = await resetpasswords.findOne({code}) ;
    if (!m){
      return res.json({error:"code invalid or expired!"}) ; 
    }

    //the code is valid!
    await resetpasswords.deleteOne({code}) ;
     
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
        return res.status(400).json({error:errors.array()})
    }

    try{
        const {newpassword , confirmpassword , email} = req.body ;
        if (newpassword !== confirmpassword){
          return res.json({error:"no correspondance!"}) ;
        }
        //now we must update with new password!
         //encrypt the pw 
        const cryptedpw = await bcrypt.hash(newpassword,14) ;  
        const user1 = await students.findOne({email:email}) ;
        const user2 = await parents.findOne({email:email}) ; 
        const user3 = await teachers.findOne({email:email}) ;
        const user4 = await admins.findOne({email:email}) ; 
        const user = user1 || user2 || user3 || user4 ;
        
        user.password = cryptedpw ; 
        await user.save() ; 
        //now remove from the resetpw db 
        await resetpasswords.deleteOne({email}) ;
        res.json({succ:"succ!!"}) ; 
  
    }catch(e){
        res.json({error:"error!"}) ; 
    }
}) ;



module.exports = router ; 