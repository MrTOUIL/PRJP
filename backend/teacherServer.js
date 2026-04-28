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
const students = require('./schemas/Student') ;
const parents = require('./schemas/parent') ;

const teacherParents = require('./schemas/teacherParent') ;
const teacherStudents = require('./schemas/teacherStudent') ;
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

router.put("/editname",protect,authorize("teacher"),
body("first").isString().isLength({min:2}),
body("last").isString().isLength({min:2}),
async(req,res) => {
   const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const {first , last} = req.body ; 
        const teacherId = req.user.id ;
        const tea = await teachers.findById(teacherId) ;
        if (!tea){
            return res.json({error:"error"}) ; 
        } 
        tea.first_name = first ;
        tea.last_name = last ; 
        await tea.save() ; 
        res.json({succ:"succ"}) ; 
    }catch(e){
        console.error(e) ;
        res.json({error:"error"}) ; 
    }
}) ;



router.put("/editadress",protect,authorize("teacher"),
body("adress").isString().isLength({min:2}),
async(req,res) => {
   const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const {adress} = req.body ; 
        const teacherId = req.user.id ;
        const tea = await teachers.findById(teacherId) ;
        if (!tea){
            return res.json({error:"error"}) ; 
        } 
        tea.postal_adress = adress ;  
        await tea.save() ; 
        res.json({succ:"succ"}) ; 
    }catch(e){
        console.error(e) ;
        res.json({error:"error"}) ; 
    }
}) ;

router.put("/editsubject",protect,authorize("teacher"),
body("subject").isString().isLength({min:2}),
async(req,res) => {
   const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const {subject} = req.body ; 
        const teacherId = req.user.id ;
        const tea = await teachers.findById(teacherId) ;
        if (!tea){
            return res.json({error:"error"}) ; 
        } 
        tea.subject = [subject] ;  
        await tea.save() ; 
        res.json({succ:"succ"}) ; 
    }catch(e){
        console.error(e) ;
        res.json({error:"error"}) ; 
    }
}) ;

router.put("/editlevel",protect,authorize("teacher"),
body("levels").isString().isLength({min:2}),
async(req,res) => {
   const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const {levels} = req.body ; 
        const teacherId = req.user.id ;
        const tea = await teachers.findById(teacherId) ;
        if (!tea){
            return res.json({error:"error"}) ; 
        } 
        tea.school_levels_taught = [levels] ;   
        await tea.save() ; 
        res.json({succ:"succ"}) ; 
    }catch(e){
        console.error(e) ;
        res.json({error:"error"}) ; 
    }
}) ;

router.put("/editmode",protect,authorize("teacher"),
body("mode").isString().isLength({min:2}),
async(req,res) => {
   const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const {mode} = req.body ; 
        const teacherId = req.user.id ;
        const tea = await teachers.findById(teacherId) ;
        if (!tea){
            return res.json({error:"error"}) ; 
        } 
        tea.mode = mode ;   
        await tea.save() ; 
        res.json({succ:"succ"}) ; 
    }catch(e){
        console.error(e) ;
        res.json({error:"error"}) ; 
    }
}) ;

router.put("/editstart",protect,authorize("teacher"),
body("start").isString().isLength({min:2}),
async(req,res) => {
   const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const {start} = req.body ; 
        const teacherId = req.user.id ;
        const tea = await teachers.findById(teacherId) ;
        if (!tea){
            return res.json({error:"error"}) ; 
        } 
        tea.start_time = start ;   
        await tea.save() ; 
        res.json({succ:"succ"}) ; 
    }catch(e){
        console.error(e) ;
        res.json({error:"error"}) ; 
    }
}) ;


router.put("/editend",protect,authorize("teacher"),
body("end").isString().isLength({min:2}),
async(req,res) => {
   const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const {end} = req.body ; 
        const teacherId = req.user.id ;
        const tea = await teachers.findById(teacherId) ;
        if (!tea){
            return res.json({error:"error"}) ; 
        } 
        tea.end_time = end ;   
        await tea.save() ; 
        res.json({succ:"succ"}) ; 
    }catch(e){
        console.error(e) ;
        res.json({error:"error"}) ; 
    }
}) ;

router.put("/editvisit",protect,authorize("teacher"),
body("visit").isString().isLength({min:2}),
async(req,res) => {
   const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const {visit} = req.body ; 
        const teacherId = req.user.id ;
        const tea = await teachers.findById(teacherId) ;
        if (!tea){
            return res.json({error:"error"}) ; 
        } 
        if (visit == "NO"){
            tea.home_visits = false ; 
        }else{
            tea.home_visits = true ; 
        }   
        await tea.save() ; 
        res.json({succ:"succ"}) ; 
    }catch(e){
        console.error(e) ;
        res.json({error:"error"}) ; 
    }
}) ;


router.put("/editvisit",protect,authorize("teacher"),
body("visit").isString().isLength({min:2}),
async(req,res) => {
   const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const {visit} = req.body ; 
        const teacherId = req.user.id ;
        const tea = await teachers.findById(teacherId) ;
        if (!tea){
            return res.json({error:"error"}) ; 
        } 
        if (visit == "NO"){
            tea.home_visits = false ; 
        }else{
            tea.home_visits = true ; 
        }   
        await tea.save() ; 
        res.json({succ:"succ"}) ; 
    }catch(e){
        console.error(e) ;
        res.json({error:"error"}) ; 
    }
}) ;

router.put("/editdescription",protect,authorize("teacher"),
body("description").isString().isLength({min:1}),
async(req,res) => {
   const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const {description} = req.body ; 
        const teacherId = req.user.id ;
        const tea = await teachers.findById(teacherId) ;
        if (!tea){
            return res.json({error:"error"}) ; 
        } 
        tea.bio = description ;
        await tea.save() ; 
        res.json({succ:"succ"}) ; 
    }catch(e){
        console.error(e) ;
        res.json({error:"error"}) ; 
    }
}) ;

router.put("/editdays",protect,authorize("teacher"),
body("days").isArray().isLength({min:1}),
async(req,res) => {
   const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const {days} = req.body ; 
        const teacherId = req.user.id ;
        const tea = await teachers.findById(teacherId) ;
        if (!tea){
            return res.json({error:"error"}) ; 
        } 
        tea.available_days = days ;
        await tea.save() ; 
        res.json({succ:"succ"}) ; 
    }catch(e){
        console.error(e) ;
        res.json({error:"error"}) ; 
    }
}) ;

router.post("/servicesession",protect,authorize("teacher"),async(req,res) => {
   try{
       const {serviceid} = req.body ;
       const serviceSessions = await sessions.find({service:serviceid}).populate("service") ; 
       res.json({succ:"succ" , sessions:serviceSessions}) ; 
   }catch(e){
       res.json({error:"error"}) ; 
   }
}) ;

router.put("/editsession",protect,authorize("teacher"),
body("newstat").isString().isLength({min:1}),
body("Date").custom((value, { req }) => {
    const status = String(req.body.newstat || "").toLowerCase();
    if (status === "confirmed" && !isValidDate(value)) throw new Error("invalid date!")
    return true ;    
}),
body("location").trim().isLength({min:1}) , 
body("start_time").trim().isLength({min:1}) ,
body("end_time").trim().isLength({min:1}) ,
async(req,res) => {
    const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }

    try{
        const {sessionid, newstat, Date, location, start_time, end_time} = req.body ; 
        const newDate = Date ; 
        const ss = await sessions.findById(sessionid) ;
        if (!ss){
            return res.json({error:"error"}) ; 
        }

        
        
        if (String(newstat).toLowerCase() == "confirmed"){
        ss.Date = newDate ;
        ss.status = newstat ; 
        ss.location = location ;
        ss.start_time = start_time ;
        ss.end_time = end_time ;
        await ss.save() ; 
        res.json({succ:"succ"}) ;
        }else{
            ss.status = newstat ;
            await ss.save() ; 
            res.json({succ:"succ"}) ;
        }
    }catch(e){
        console.error(e) ;
        res.json({error:"error"}) ; 
    }
}
)

//add a route that fetch the students and parents according to a search query(per name)
router.post("/searchusers",protect,authorize("teacher"),async(req,res) => {
    try{
        const {query , serviceid} = req.body ; 
        //if query is empty , return all the students and parents
        if (!query || query.trim() === "") {   
            const allParents = await parents.find() ;
            //here we should also exclude those who are already related to the teacher in the teacherParents collection for this service
            const teacherParentRelations = await teacherParents.find({teacher:req.user.id , service:serviceid}) ;
            const relatedParentIds = teacherParentRelations.map(rel => String(rel.parent)) ;
            const filteredAllParents = allParents.filter(parent => !relatedParentIds.includes(String(parent._id))) ;
            const allStudents = await students.find() ;
            //same for students : exclude those who are already related to the teacher in the teacherStudent collection for this service
            const teacherStudentRelations = await teacherStudents.find({teacher:req.user.id , service:serviceid}) ;
            const relatedStudentIds = teacherStudentRelations.map(rel => String(rel.student)) ;
            const filteredAllStudents = allStudents.filter(student => !relatedStudentIds.includes(String(student._id))) ;
            return res.json({succ:"succ" , students:filteredAllStudents , parents:filteredAllParents}) ;
        }

        //now if query not empty , fetch according to the name
        const lowercasequery = query.toLowerCase() ; 
        const matchedStudents = await students.find({$or:[
            {first_name:{$regex:lowercasequery , $options:"i"}},
            {last_name:{$regex:lowercasequery , $options:"i"}}
        ]}) ; 
        //in fact I need to fetch those who are not in the teacherStudent collection of this teacher 
        //let's do it : 
        const teacherStudentRelations = await teacherStudents.find({teacher:req.user.id , service:serviceid}) ;
        //let's do intersection between matchedStudents and teacherStudentRelations to exclude those who are already related to the teacher(for this service) in the teacherStudent collection
        const relatedStudentIds = teacherStudentRelations.map(rel => String(rel.student)) ;
        const filteredMatchedStudents = matchedStudents.filter(student => !relatedStudentIds.includes(String(student._id))) ;
        
        const matchedParents = await parents.find({$or:[
            {first_name:{$regex:lowercasequery , $options:"i"}},
            {last_name:{$regex:lowercasequery , $options:"i"}}
        ]}) ; 
        //same for parents : exclude those who are already related to the teacher in the teacherParents collection
        const teacherParentRelations = await teacherParents.find({teacher:req.user.id , service:serviceid}) ;
        const relatedParentIds = teacherParentRelations.map(rel => String(rel.parent)) ;
        const filteredMatchedParents = matchedParents.filter(parent => !relatedParentIds.includes(String(parent._id))) ;


        res.json({succ:"succ" , students:filteredMatchedStudents , parents:filteredMatchedParents}) ;
    }catch(e){
        console.error(e) ;
        res.json({error:"error"}) ; 
    }
}) ; 


router.post("/addstudent",protect,authorize("teacher"),async(req,res) =>{
    try{
        const {serviceid , studentid} = req.body ; 
        await teacherStudents.create({
            teacher:req.user.id , 
            student:studentid ,
            service:serviceid
        }) ;
        res.json({succ:"succ"}) ;

    }catch(e){
        console.error(e) ;
        res.json({error:"error"}) ;
    }
}) ; 


router.post("/addparent",protect,authorize("teacher"),async(req,res) =>{
    try{
        const {serviceid , parentid} = req.body ;   
        await teacherParents.create({
            teacher:req.user.id , 
            parent:parentid ,
            service:serviceid
        }) ;
        res.json({succ:"succ"}) ;
    }catch(e){
        console.error(e) ;
        res.json({error:"error"}) ;
    }    
}) ;


router.post("/getstudents",protect,authorize("teacher"),async(req,res) => {
    try{
        const {serviceid} = req.body ; 
        const teacherStudentRelations = await teacherStudents.find({teacher:req.user.id , service:serviceid}).populate("student") ;
        const studentsList = teacherStudentRelations.map(rel => rel.student) ;

        const teacherParentRelations = await teacherParents.find({teacher:req.user.id , service:serviceid}).populate("parent") ;
        const parentsList = teacherParentRelations.map(rel => rel.parent) ;
        res.json({succ:"succ" , students:studentsList , parents:parentsList}) ;
    }catch(e){
        console.error(e) ;
        res.json({error:"error"}) ;
    }
})

//get all students of a teacher for all his services :
router.get("/getallstudents",protect,authorize("teacher"),async(req,res) => {
    try{
        const teacherStudentRelations = await teacherStudents.find({teacher:req.user.id}).populate("student") ;
        const studentsList = teacherStudentRelations.map(rel => rel.student) ;

        const teacherParentRelations = await teacherParents.find({teacher:req.user.id}).populate("parent") ;
        const parentsList = teacherParentRelations.map(rel => rel.parent) ;

        res.json({succ:"succ" , students:studentsList , parents:parentsList}) ;
    }catch(e){
        console.error(e) ;
        res.json({error:"error"}) ;
    }
})
module.exports = router ;