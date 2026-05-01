const express = require('express');
const router = express.Router();
const students = require('./schemas/Student');
const { protect, authorize } = require('./middleware');






// get  profile (student space) 

router.get('/getProfile', protect, authorize('student'), async (req, res) => {
    try {
        const studentId = req.user.id;
        const teacherStudentsModel = require('./schemas/teacherStudent');
        const request_students = require('./schemas/request_student');
        const evaluations = require('./schemas/evaluation_student');
        const teachersModel = require('./schemas/teacher');
        const servicesModel = require('./schemas/service');

        // basic student info
        const studentData = await students.findById(studentId);
        if (!studentData) {
            return res.status(404).json({ error: "Student not found!" });
        }

        // joined services
        const joinedServices = await teacherStudentsModel
            .find({ student: studentId })
            .populate('teacher', '-password')
            .populate('service');

        // get joined service IDs to exclude from suggestions
        const joinedServiceIds = joinedServices.map(j => String(j.service?._id));

        // suggested services (not joined, max 5)
        const suggestedServices = await servicesModel
            .find({ _id: { $nin: joinedServiceIds } })
            .populate('done_by', '-password')
            .limit(5);

        // suggested teachers (matching student level, sorted by rating, max 6)
        const suggestedTeachers = await teachersModel
            .find({
                school_levels_taught: { $in: [studentData.academic_level] }
            })
            .select('-password')
            .sort({ rating: -1 })
            .limit(6);

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
            myEvaluations
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});


// GET /student/suggestions
router.get('/suggestions', protect, authorize('student'), async (req, res) => {
    try {
        const teachersModel = require('./schemas/teacher');
        
        const studentData = await students.findById(req.user.id);

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
router.get('/searchTeachers', async (req, res) => {
    try {
        const { subject, level, mode } = req.query;
        
        let filter = {};
        
        if (subject) filter.subject = { $in: [subject] };
        if (level) filter.school_levels_taught = { $in: [level] };
        if (mode) filter.mode = mode;

        const teachers = require('./schemas/teacher');
        const results = await teachers.find(filter).select('-password');
        

        res.json({ succ: "Teachers fetched!", teachers: results });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

// GET /student/getTeacher/:teacherId 
// student check profile of teachers 
router.get('/getTeacher/:teacherId', async (req, res) => {
    try {
        const teachers = require('./schemas/teacher');
        const teacherData = await teachers.findById(req.params.teacherId).select('-password');
        
        if (!teacherData) {
            return res.status(404).json({ error: "Teacher not found!" });
        }

        res.json({ succ: "Teacher fetched!", teacher: teacherData });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});


/*
// GET /student/suggestions
router.get('/suggestions', protect, authorize('student'), async (req, res) => {
    try {
        const teachersModel = require('./schemas/teacher');
        
        const studentData = await students.findById(req.user.id);

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
router.post('/evaluate', protect, authorize('student'), async (req, res) => {
    try {
        const evaluations = require('./schemas/evaluation_student');
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
router.post('/sendRequest', protect, authorize('student'), async (req, res) => {
    try {
        const request_students = require('./schemas/request_student');
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
router.get('/myRequests', protect, authorize('student'), async (req, res) => {
    try {
        const request_students = require('./schemas/request_student');
        
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
router.put('/cancelRequest/:id', protect, authorize('student'), async (req, res) => {
    try {
        const request_students = require('./schemas/request_student');
        
        const request = await request_students.findById(req.params.id);
        
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
router.delete('/deleteRequest/:id', protect, authorize('student'), async (req, res) => {
    try {
        const request_students = require('./schemas/request_student');
        
        const request = await request_students.findById(req.params.id);
        
        if (!request) {
            return res.status(404).json({ error: "Request not found!" });
        }

        if (request.status !== "rejected" && request.status !== "cancelled") {
            return res.json({ error: "Only rejected or cancelled requests can be deleted!" });
        }

        await request_students.findByIdAndDelete(req.params.id);

        res.json({ succ: "Request deleted!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});





// PUT /student/editProfile
router.put('/editProfile', protect, authorize('student'), async (req, res) => {
    try {
        const { first_name, last_name, phone, postal_adress, academic_level } = req.body;
        
        const student = await students.findById(req.user.id);
        if (!student) return res.status(404).json({ error: "Student not found!" });

        if (first_name) student.first_name = first_name;
        if (last_name) student.last_name = last_name;
        if (phone) student.phone = phone;
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
router.get('/allServices', protect, authorize('student'), async (req, res) => {
    try {
        const servicesModel = require('./schemas/service');
        const teacherStudents = require('./schemas/teacherStudent');

        // get all services student already joined
        const joined = await teacherStudents.find({ student: req.user.id });
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
router.get('/joinedServices', protect, authorize('student'), async (req, res) => {
    try {
        const teacherStudents = require('./schemas/teacherStudent');
        
        const joined = await teacherStudents
            .find({ student: req.user.id })
            .populate('teacher', '-password')
            .populate('service');

        res.json({ succ: "Joined services fetched!", joinedServices: joined });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});


// GET /student/joinedServices/:teacherId/sessions
router.get('/joinedServices/:teacherId/sessions', protect, authorize('student'), async (req, res) => {
    try {
        const sessions = require('./schemas/session');
        
        const teacherSessions = await sessions
            .find({ done_by: req.params.teacherId })
            .populate('service');

        res.json({ succ: "Sessions fetched!", sessions: teacherSessions });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
}); 

// GET /student/joinedServices/:teacherId/sessions/:sessionId/documents
router.get('/joinedServices/:teacherId/sessions/:sessionId/documents', protect, authorize('student'), async (req, res) => {
    try {
        const documents = require('./schemas/document');
        
        const sessionDocs = await documents
            .find({ session: req.params.sessionId });

        res.json({ succ: "Documents fetched!", documents: sessionDocs });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});


module.exports = router;