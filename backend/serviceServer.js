//this part is only for creating a service , and deleting a service ... that's all
const express = require('express') ; 
const router = express.Router() ; 
const { body , validationResult } = require('express-validator');
const services = require('./schemas/service') ; 
const {protect , authorize} = require('./middleware') ;
const b2 = require('./b2') ; 
const upload = require('./upload') ;

const BUCKET_NAME = process.env.B2_BUCKET_NAME;
const BUCKET_ID = process.env.B2_BUCKET_ID;

//create a service 
function checkcost(cost){
    if (cost < 0){
        return false ; 
    }else{
        return true ; 
    }
}

router.post('/createservice',protect,authorize("teacher"),upload.single("file"),
body("cost").custom(value => {
    if (!checkcost(value))
        throw new Error("invalid cost!")
    else
        return true ; 
}) // check the validity of cost(cannot add negative cost)
,async(req,res) => {
    const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
   try{
        if (!req.file){
          return res.json({ error: "File is required" });
        }
        await b2.authorize();
        const uploadUrl = await b2.getUploadUrl({ bucketId: BUCKET_ID });
        const fileName = `${Date.now()}-${req.file.originalname}`;

        const uploadResponse = await b2.uploadFile({
            uploadUrl: uploadUrl.data.uploadUrl,
            uploadAuthToken: uploadUrl.data.authorizationToken,
            fileName,
            data: req.file.buffer,
        });
        const fileUrl = `https://f005.backblazeb2.com/file/${BUCKET_NAME}/${fileName}`;
        
        //create the service in our database!
        await services.create({
            type:req.body.type , 
            target_audiance:req.body.target_audiance , 
            mode:req.body.mode , 
            expectations:req.body.expectations , 
            duration:req.body.duration , 
            cost:req.body.cost , 
            source:fileUrl ,
            fileId:uploadResponse.data.fileId, 
            comment:req.body.comment , 
            done_by:req.body.id
        }); 

        res.json({succ:"added successfully!"}) ; 
   }catch(e){
        res.json({error:"error!"}) ; 
   }
}) ;

module.exports = router ;