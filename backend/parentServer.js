const express = require('express');
const router = express.Router();
const parents = require('./schemas/parent');
const { protect, authorize } = require('./middleware');
const messages = require('./schemas/message') ;
const { body, validationResult } = require('express-validator');






// get  profile (student space) 

router.get('/getProfile', protect, authorize('parent'), async (req, res) => {
    try {
        const studentId = req.user.id;
        const teacherStudentsModel = require('./schemas/teacherParent');
        const request_students = require('./schemas/request_parent');
        const evaluations = require('./schemas/evaluation_parents');
        const teachersModel = require('./schemas/teacher');
        const servicesModel = require('./schemas/service');

        // basic student info
        const studentData = await parents.findById(studentId);
        if (!studentData) {
            return res.status(404).json({ error: "Student not found!" });
        }

        // joined services
        const joinedServices = await teacherStudentsModel
            .find({ parent: studentId })
            .populate('teacher', '-password')
            .populate('service');

        //extract all services now 
        const allServices = await servicesModel.find().populate('done_by', '-password');
        //now we will do the intersection of the two arrays , so that we get the all other services that the student did not join
        const joinedServiceIdss = joinedServices.map(j => String(j.service?._id));
        const notJoinedServices = allServices.filter(s => !joinedServiceIdss.includes(String(s._id))) ;   

        // get joined service IDs to exclude from suggestions
        const joinedServiceIds = joinedServices.map(j => String(j.service?._id));


        let studentSessions = [] ; 
        //if student has no joined services , he won't have sessions and document 
        if (joinedServiceIds.length > 0){
            //extract sessions for all joined services
            const sessionsModel = require('./schemas/session');
            const sessionPromises = joinedServiceIds.map(serviceId => 
                sessionsModel.find({service: serviceId}).populate('done_by').populate('service')
            );
            const allSessions = await Promise.all(sessionPromises);
            studentSessions = allSessions.flat();

            //now let's sort them by date and time (soonest first)
            const parseSessionDateTime = (dateStr, timeStr) => {
                if (!dateStr || typeof dateStr !== 'string' || !timeStr) return Number.POSITIVE_INFINITY;
                const parts = dateStr.split('/');
                if (parts.length !== 3) return Number.POSITIVE_INFINITY;
                const [day, month, year] = parts;
                const parsed = new Date(`${year}-${month}-${day}T${timeStr}`);
                return Number.isNaN(parsed.getTime()) ? Number.POSITIVE_INFINITY : parsed.getTime();
            };

            studentSessions.sort((a, b) => {
                const timeA = parseSessionDateTime(a?.Date, a?.start_time);
                const timeB = parseSessionDateTime(b?.Date, b?.start_time);
                return timeA - timeB;
            });
        }
        
        // suggested services (not joined, max 5)
        //also we suggest the services with same level as student level (we check if the target_audiance.includes(studentData.academic_level)) , if we have less than 5 we fill the rest with other services (same as teacher suggestions logic)
        const suggestedServices = await servicesModel
            .find({ _id: { $nin: joinedServiceIds } , target_audiance: { $regex: studentData.academic_level, $options: 'i' } } )
            .populate('done_by', '-password')
            .limit(3);

        // suggested teachers (matching student level, sorted by rating, max 6)
        const suggestedTeachers = await teachersModel
            .find({
                school_levels_taught: { $in: [studentData.academic_level] }
            })
            .select('-password')
            .sort({ rating: -1 })
            .limit(4);

        // my requests
        const myRequests = await request_students
            .find({ requester: studentId })
            .populate('res_by', '-password');

        // my evaluations
        const myEvaluations = await evaluations
            .find({ evaluator: studentId })
            .populate('evaluated', '-password');

        // remove password
        const { password, ...studentWithoutPassword } = studentData.toObject();

        

        res.json({
            succ: "Profile fetched successfully!",
            student: studentWithoutPassword,
            joinedServices,
            suggestedServices,
            suggestedTeachers,
            myRequests,
            myEvaluations , 
            StudentSessions : studentSessions ,
            notJoinedServices , 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

// Refresh access token using refresh token
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: "Refresh token is required!" });
        }
        const jwt = require('jsonwebtoken');
        const tokens = require('./schemas/tokens');

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const storedToken = await tokens.findOne({ userId: decoded.id, token: refreshToken });
        if (!storedToken) {
            return res.status(401).json({ error: "Invalid refresh token!" });
        }
        const accessToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ succ: "Token refreshed!", accessToken });
    } catch (err) {
        return res.status(401).json({ error: "Error in refreshing the token!" });
    }
});


// GET /student/suggestions
router.get('/suggestions', protect, authorize('parent'), async (req, res) => {
    try {
        const teachersModel = require('./schemas/teacher');
        
        const studentData = await parents.findById(req.user.id);

        const matchingTeachers = await teachersModel
            .find({ school_levels_taught: { $in: [studentData.academic_level] } })
            .select('-password')
            .sort({ rating: -1 })
            .limit(6);

        if (matchingTeachers.length >= 6) {
            return res.json({ succ: "Suggestions fetched!", teachers: matchingTeachers });
        }

        const matchingIds = matchingTeachers.map(t => t._id);
        const remaining = 6 - matchingTeachers.length;

        const otherTeachers = await teachersModel
            .find({ _id: { $nin: matchingIds } })
            .select('-password')
            .sort({ rating: -1 })
            .limit(remaining);

        const suggestions = [...matchingTeachers, ...otherTeachers];

        res.json({ succ: "Suggestions fetched!", teachers: suggestions });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});



// GET /student/searchTeachers  
// studnet search for teacher                                                         
router.post('/searchTeachers', protect , authorize('parent'),async (req, res) => {
    try {
        const { query } = req.body ; 
        //search by location only (postal_adress)!
        const teachers = require('./schemas/teacher');
        const q = (query || '').trim();
        let results = [];
        if (!q) {
            results = await teachers.find(); // if no query, return them all
        } else {
            const regex = { $regex: q, $options: 'i' };
            results = await teachers.find({
                $or: [
                    { postal_adress: regex },
                    { subject: regex },
                    { school_levels_taught: regex },
                ],
            });
        }
        res.json({ succ: "Search completed!", teachers: results }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

// GET /student/getTeacher/:teacherId 
// student check profile of teachers 
router.get('/getTeacher/:teacherId', protect, authorize('parent'), async (req, res) => {
    try {
        const teachers = require('./schemas/teacher');
        //const studentevaluations = require('./schemas/evaluation_parents');
        //const parentEvaluations = require('./schemas/evaluation_parents');
        

        const teacherData = await teachers.findById(req.params.teacherId).select('-password');
        
        //const evaluationsStudents = await studentevaluations.find({ evaluated: req.params.teacherId }).populate('evaluator', '-password');
        //const evaluationsParents = await parentEvaluations.find({ evaluated: req.params.teacherId }).populate('evaluator', '-password');
        if (!teacherData) {
            return res.status(404).json({ error: "Teacher not found!" });
        }

        res.json({ succ: "Teacher fetched!", teacher: teacherData  /*evaluationsStudents , evaluationsParents*/ });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});


/*
// GET /student/suggestions
router.get('/suggestions', protect, authorize('parent'), async (req, res) => {
    try {
        const teachersModel = require('./schemas/teacher');
        
        const studentData = await parents.findById(req.user.id);

        const matchingTeachers = await teachersModel
            .find({ school_levels_taught: { $in: [studentData.academic_level] } })
            .select('-password')
            .sort({ rating: -1 })
            .limit(6);

        if (matchingTeachers.length >= 6) {
            return res.json({ succ: "Suggestions fetched!", teachers: matchingTeachers });
        }

        const matchingIds = matchingTeachers.map(t => t._id);
        const remaining = 6 - matchingTeachers.length;

        const otherTeachers = await teachersModel
            .find({ _id: { $nin: matchingIds } })
            .select('-password')
            .sort({ rating: -1 })
            .limit(remaining);

        const suggestions = [...matchingTeachers, ...otherTeachers];

        res.json({ succ: "Suggestions fetched!", teachers: suggestions });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

*/

// POST /student/evaluate
router.post('/evaluate', protect, authorize('parent'), async (req, res) => {
    try {
        const evaluations = require('./schemas/evaluation_parents');
        const teachers = require('./schemas/teacher');

        const { teacherId, note, comment } = req.body;
        const studentId = req.user.id;

        // validate note is between 1 and 5
        if (!note || note < 1 || note > 5) {
            return res.status(400).json({ error: "Note must be between 1 and 5!" });
        }
    
        const teacherData = await teachers.findById(teacherId);
        if (!teacherData) {
            return res.status(404).json({ error: "Teacher not found!" });
        }

        const date = new Date().toLocaleDateString('en-GB');
        await evaluations.create({
            note,
            comment,
            date,
            evaluator: studentId,
            evaluated: teacherId
        });

        const allEvals = await evaluations.find({ evaluated: teacherId });
        const average = allEvals.reduce((sum, e) => sum + e.note, 0) / allEvals.length;
        
        await teachers.findByIdAndUpdate(teacherId, { rating: average.toFixed(1) });

        res.json({ succ: "Evaluation submitted!", averageRating: average.toFixed(1) });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});


// POST /student/sendRequest
router.post('/sendRequest', protect, authorize('parent'), async (req, res) => {
    try {
        const request_students = require('./schemas/request_parent');
        const { teacherId, matiere, niveau, objectif, frequence, duree, price, mode } = req.body;

        await request_students.create({
            matiere,
            niveau,
            objectif,
            frequence,
            duree,
            price,
            mode,
            status: "pending",
            requester: req.user.id,
            res_by: teacherId
        });

        res.json({ succ: "Request sent successfully!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

// GET /student/myRequests
router.get('/myRequests', protect, authorize('parent'), async (req, res) => {
    try {
        const request_students = require('./schemas/request_parent');
        
        const myRequests = await request_students
            .find({ requester: req.user.id })
            .populate('res_by', '-password'); // get teacher info

        res.json({ succ: "Requests fetched!", requests: myRequests });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});


// PUT /student/cancelRequest/:id
router.put('/cancelRequest/:id', protect, authorize('parent'), async (req, res) => {
    try {
        const request_students = require('./schemas/request_parent');
        
        const request = await request_parents.findById(req.params.id);
        
        if (!request) {
            return res.status(404).json({ error: "Request not found!" });
        }

        if (request.status !== "pending") {
            return res.json({ error: "Only pending requests can be cancelled!" });
        }

        request.status = "cancelled";
        await request.save();

        res.json({ succ: "Request cancelled!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

// DELETE /student/deleteRequest/:id
router.delete('/deleteRequest/:id', protect, authorize('parent'), async (req, res) => {
    try {
        const request_students = require('./schemas/request_parent');
        
        const request = await request_parents.findById(req.params.id);
        
        if (!request) {
            return res.status(404).json({ error: "Request not found!" });
        }

        if (request.status !== "rejected" && request.status !== "cancelled") {
            return res.json({ error: "Only rejected or cancelled requests can be deleted!" });
        }

        await request_parents.findByIdAndDelete(req.params.id);

        res.json({ succ: "Request deleted!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});





// PUT /student/editProfile
router.put('/editProfile', protect, authorize('parent'), async (req, res) => {
    try {
        const { first_name, last_name , postal_adress, academic_level } = req.body;
        
        const student = await parents.findById(req.user.id);
        if (!student) return res.status(404).json({ error: "Student not found!" });

        if (first_name) student.first_name = first_name;
        if (last_name) student.last_name = last_name;
        if (postal_adress) student.postal_adress = postal_adress;
        if (academic_level) student.academic_level = academic_level;

        await student.save();
        
        const { password, ...updatedStudent } = student.toObject();
        res.json({ succ: "Profile updated!", student: updatedStudent });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
}); 


/* sessions and cocuments lists */


// GET /student/allServices ( but not the joined ones )
// GET /student/allServices (excludes joined ones)
router.get('/allServices', protect, authorize('parent'), async (req, res) => {
    try {
        const servicesModel = require('./schemas/service');
        const teacherStudents = require('./schemas/teacherParent');

        // get all services student already joined
        const joined = await teacherStudents.find({ parent: req.user.id });
        const joinedServiceIds = joined.map(j => String(j.service));

        // return all services EXCEPT joined ones
        const allServices = await servicesModel
            .find({ _id: { $nin: joinedServiceIds } })
            .populate('done_by', '-password');

        res.json({ succ: "All services fetched!", services: allServices });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});


// GET /student/joinedServices
router.get('/joinedServices', protect, authorize('parent'), async (req, res) => {
    try {
        const teacherStudents = require('./schemas/teacherParent');
        
        const joined = await teacherStudents
            .find({ parent: req.user.id })
            .populate('teacher', '-password')
            .populate('service');

        res.json({ succ: "Joined services fetched!", joinedServices: joined });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});


// GET /student/joinedServices/:serviceId/sessions
router.get('/joinedServices/:serviceId/sessions', protect, authorize('parent'), async (req, res) => {
    try {
        const sessions = require('./schemas/session');
        
        const teacherSessions = await sessions
            .find({ service: req.params.serviceId })
            .populate('service');

        res.json({ succ: "Sessions fetched!", sessions: teacherSessions });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
}); 

// GET /student/joinedServices/:serviceId/sessions/:sessionId/documents
router.get('/joinedServices/:serviceId/sessions/documents', protect, authorize('parent'), async (req, res) => {
    try {
        const documents = require('./schemas/document');
        const sessions = require('./schemas/session');
        //I intend to extract all documents related to all sessions of the joined service
        //let's do it : 

        const sessionDocs = await sessions.find({ service: req.params.serviceId });
        const sessionIds = sessionDocs.map(s => s._id) ; 
        const documentslist = await documents.find({ session: { $in: sessionIds}}) ; 

        res.json({ succ: "Documents fetched!", documentslist });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

router.get("/getmessages",protect,authorize("parent"),async(req,res) => {
   try{
       const parentId = req.user.id ; 
    const msgsRaw = (await messages.find({ receiver: parentId }).lean()).reverse(); //to show the latest message first

       // Now we will populate the sender field manually to include the sender's name and role

       const Teachers = require('./schemas/teacher');
       const Parents = require('./schemas/parent');
       const Students = require('./schemas/Student');

       const populated = await Promise.all(msgsRaw.map(async (m) => {
           let senderObj = null;
           if (m && m.sender) {
               senderObj = await Teachers.findById(m.sender).select('-password').lean();
               if (!senderObj) senderObj = await Parents.findById(m.sender).select('-password').lean();
               if (!senderObj) senderObj = await Students.findById(m.sender).select('-password').lean();
           }
           return { ...m, sender: senderObj || m.sender };
       }));

       res.json({ succ: "succ", messages: populated });
   }catch(e){
        console.error(e) ;
        res.json({error:"error"}) ; 
   }
}) ; 

/*router.get("/getmessages",protect,authorize("student"),async(req,res) => {
   try{
       const parentId = req.user.id ; 
       const msgsRaw = await messages.find({ receiver: studentId }).lean();

       const Teachers = require('./schemas/teacher');
       const Parents = require('./schemas/parent');
       const Students = require('./schemas/Student');

       const populated = await Promise.all(msgsRaw.map(async (m) => {
           let senderObj = null;
           if (m && m.sender) {
               senderObj = await Teachers.findById(m.sender).select('-password').lean();
               if (!senderObj) senderObj = await Parents.findById(m.sender).select('-password').lean();
               if (!senderObj) senderObj = await Students.findById(m.sender).select('-password').lean();
           }
           return { ...m, sender: senderObj || m.sender };
       }));

       res.json({ succ: "succ", messages: populated });
   }catch(e){
        console.error(e) ;
        res.json({error:"error"}) ; 
   }
}) ;*/

router.post("/sendmessage",protect,authorize("parent"),
body("msg").isString().notEmpty().isLength({ max: 100 })
,async(req,res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ error: errors.array() });
   }
   try{
        const { msg , receiverId } = req.body ;
        const senderId = req.user.id ;
        await messages.create({
            sender: senderId,
            receiver: receiverId,
            msg,
            actors: "parents"
        }) ; 
        res.json({succ:"Message sent!"}) ;    
   }catch(e){
        console.error(e) ;
        res.json({error:"error"}) ; 
   }
}) ; 


// Reply route to teachers (parent -> teacher) using `reciever` field like student sendmessage2
router.post("/sendmessage2",protect,authorize("parent"),
body("msg").isString().notEmpty().isLength({ max: 100 })
,async(req,res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
   }

   try{
       const { msg , reciever } = req.body ;
       const senderId = req.user.id ;
       // Ensure recipient teacher exists
       const teachers = require('./schemas/teacher');
       const receiverr = await teachers.findById(reciever);
       if (!receiverr) return res.status(404).json({ error: "Recipient teacher not found" });
       await messages.create({ sender: senderId, receiver: reciever, msg, actors: "teachers" });
       res.json({ succ: "Message sent to teacher!" });
   }catch(e){
       console.error(e) ;
       res.json({error:"error"}) ;
   }
}) ; 


module.exports = router;
