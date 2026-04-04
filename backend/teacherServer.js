//teacherServer.js:responsible for handling all teacher related requests
const express = require("express");
const router = express.Router();
const teacher = require("./schemas/teacher");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const tokens = require('./schemas/tokens') ;
const teachers = require('./schemas/teacher') ;
const sessions = require('./schemas/session') ;
const request_parents = require('./schemas/request_parent') ;
const request_students = require('./schemas/request_student') ;
const services = require('./schemas/service') ; 
const evaluations_students = require('./schemas/evaluation_student') ;
const evaluation_parents = require('./schemas/evaluation_parents') ;
const documents = require('./schemas/document') ;
//const services = require('./schemas/service') ; 

const { protect, authorize } = require("./middleware");

router.get("/getProfile" , protect , authorize("teacher") , async (req,res) => {
    try{
        const teacherId = req.user.id ; //decoding already done in middleware
        const teacherData = await teachers.findById(teacherId) ; 
        if (!teacherData) {
            return res.status(404).json({ error: "Teacher not found!" });
        }
        //let's return also the sessions of this teacher
        const teacherSessions = await sessions.find({ done_by: teacherId }).populate("service") ;
        const parseDate = (str) => {
           const [day, month, year] = str.split("/");
           return new Date(year, month - 1, day);
        };

        const sortedSessions = [...teacherSessions].sort((a, b) => parseDate(a.date) - parseDate(b.date));
        
        //let's return the requests 
        const parentRequests = await request_parents.find({ res_by: teacherId }).populate("requester") ;
        const studentRequests = await request_students.find({ res_by: teacherId }).populate("requester") ;
        let reqs = [] ;
        if (studentRequests.length == 0 && parentRequests.length == 0){
            reqs = [] ;
        }
        else reqs = [parentRequests[0],parentRequests[1],studentRequests[0],studentRequests[1]] ;
        //let's return the services of this teacher 
        const teacherServices = await services.find({ done_by: teacherId }) ;
          
        const evaluationsFromStudents = await evaluations_students.find({ evaluated: teacherId }).populate("evaluator") ;
        //sort by date 
        evaluationsFromStudents.sort((a, b) => parseDate(a.date) - parseDate(b.date));
        const evaluationsFromParents = await evaluation_parents.find({ evaluated: teacherId }).populate("evaluator") ;
        //sort by date 
        evaluationsFromParents.sort((a, b) => parseDate(a.date) - parseDate(b.date));


        let evs = [] ; 
        if (evaluationsFromStudents.length == 0 && evaluationsFromParents.length == 0){
            evs = [] ;
        }else{
            evs = [evaluationsFromStudents[0],evaluationsFromParents[0]] ;
        }
        res.json({succ:"profile fetched successfully" , teacher:teacherData , sessions:teacherSessions , sortedSessions , upcomingSession:sortedSessions[0]
        , parentRequests , studentRequests , reqs , teacherServices , evaluationsFromStudents , evaluationsFromParents , evs }) ;
         
    }catch(err){
        console.error(err);
    }
}) ; 

router.post("/refresh" , async(req,res) => {
    try{
        const { refreshToken } = req.body ; 
        if (!refreshToken){
            return res.status(400).json({ error: "Refresh token is required!" });
        }
        const decoded = jwt.verify(refreshToken , process.env.REFRESH_SECRET) ;
        //check if the token exists in the database
        const storedToken = await tokens.findOne({ userId:decoded.id , token:refreshToken }) ;
        if (!storedToken){
            return res.status(401).json({ error: "Invalid refresh token!" });
        }
        const accessToken = jwt.sign({ id:decoded.id , role:decoded.role} , process.env.JWT_SECRET , { expiresIn:"1h" }) ;
        res.json({ succ:"Token refreshed!",accessToken }) ;
    }catch(err){
        res.status(401).json({ error: "Error in refreshing the token!" }) ;
    } 
});

//the route for creating a service 
function checkcost(cost){
    if (cost < 0){
        return false ; 
    }else{
        return true ; 
    }
}

router.post("/create_service", protect , authorize("teacher") ,
  body("title").trim().isLength({min:1}),
  body("type").trim().isLength({min:1}) , 
  body("target_audiance").trim().isLength({min:1}) ,
  body("mode").trim().isLength({min:1}) , 
  body("cost").custom(value => {
    if (!checkcost(value))
        throw new Error("invalid cost!")
    else
        return true ; 
}) , async(req,res) => {
   
    const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
     
    try{
        const {title , type , target_audiance , mode , cost , comment} = req.body ;
        await services.create({
            title , type , target_audiance , mode , cost , comment , done_by:req.user.id
        }) ; 


        res.json({succ:"successfully"}) ; 
    }catch(e){
        console.log(e) ;
        res.json({error:"error"}) ; 
    }
}) ; 

function isValidDate(dateStr) {
  // Check format with regex: dd/mm/yyyy
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateStr)) return false;

  const [day, month, year] = dateStr.split("/").map(Number);

  // Check month range
  if (month < 1 || month > 12) return false;

  // Check day validity using Date object
  const date = new Date(year, month - 1, day);
  const isValidDay =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!isValidDay) return false;

  // Check that the date is >= today (ignore time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date >= today;
}

router.post("/create_session",protect,authorize("teacher") , 
body("Date").custom(value => {
    if (!isValidDate(value)) throw new Error("invalid date!")
    return true ;    
}),
body("start_time").trim().isLength({min:1}) ,
body("end_time").trim().isLength({min:1}) , 
body("location").trim().isLength({min:1}) , 
body("status").trim().isLength({min:1}) ,  
async(req,res) => {
    const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }

    try{
        const {serviceid , Date , start_time , end_time , location , status} = req.body ; 
        
        const ss = await sessions.find({done_by:req.user.id}) ; //table of sessions 
        //check if there is no conflict
        for (const session of ss) {
           const existingStart = new Date(`${session.Date}T${session.start_time}`);
           const existingEnd   = new Date(`${session.Date}T${session.end_time}`);
           const newStart      = new Date(`${Date}T${start_time}`);
           const newEnd        = new Date(`${Date}T${end_time}`);

           if (newStart < existingEnd && newEnd > existingStart) {
              return res.status(409).json({
               error: `Scheduling conflict with an existing session on ${session.Date} from ${session.start_time} to ${session.end_time}`
              });
            }
        }

        //no conflict , now let's add in the db 
        await sessions.create({
            Date , start_time , end_time , location , status , service:serviceid , done_by:req.user.id 
        }) ; 

        res.json({succ:"successful"}) ;

    }catch(e){
        console.log(e) ;
        res.json({error:"error"}) ;
    }
})

router.get("/getalldocuments",protect,authorize("teacher"),async(req,res) => {
    try{
        const alldocuments = await documents.find({done_by:req.user.id}) ; 
        res.json({succ:"succ" , documents: alldocuments}) ; 
    }catch(e){
        console.log(e) ;
        res.json({error:"error"}) ;
    }
}) ;

module.exports = router ;