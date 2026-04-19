//this part is only for uploading a document
const express = require('express') ; 
const router = express.Router() ; 
const { body , validationResult } = require('express-validator'); 
const {protect , authorize} = require('./middleware') ;
const b2 = require('./b2') ; 
const upload = require('./upload') ;
const documents = require('./schemas/document') ;

const BUCKET_NAME = process.env.B2_BUCKET_NAME;
const BUCKET_ID = process.env.B2_BUCKET_ID;


router.post("/create_document" , protect , authorize("teacher"), upload.single("document") ,
body("title").trim().isLength({min:1}),
body("type_doc").trim().isLength({min:1})
, async(req,res) => {
    const errors = validationResult(req) ; 
    if (!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }

    try{
        if (!req.file) {
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

        // ✅ Replace the old fileUrl line with this:
        const authResponse = await b2.getDownloadAuthorization({
          bucketId: BUCKET_ID,
          fileNamePrefix: fileName,
          validDurationInSeconds: 604800, // 1 week
        });

        const fileUrl = `https://f005.backblazeb2.com/file/${BUCKET_NAME}/${fileName}?Authorization=${authResponse.data.authorizationToken}`;

        
        await documents.create({
            title: req.body.title ,
            type_doc: req.body.type_doc,
            url: fileUrl,
            fileId: uploadResponse.data.fileId,
            date: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY
            session:req.body.sessionid , 
            done_by:req.user.id 
        });

        res.json({ succ: "Document uploaded successfully!" });
        
    }catch(e){
        console.log(e);
        res.json({ error: "error" });
    }
}) ; 

router.post("/getdocuments" , protect , authorize("teacher") , async(req,res) => {
    try{
        const {sessionid} = req.body ; 
        const d = await documents.find({session : sessionid}) ;
        res.json({succ:"fetched successfully" , documents:d}) ;
    }catch(e){
        console.log(e);
        res.json({ error: "error" });
    }
})

/*router.delete("/deletedocument",protect,authorize("teacher") , async(req,res) => {
    try{
        const {id} = req.body ; 
        const media = await documents.findOne({_id:id}) ;
        if (!media){
            return res.json({error:"not found!"}) ;
        }
        await b2.authorize() ;
        await b2.deleteFileVersion({
            fileId:media.fileId
        }) ; 
        await media.deleteOne() ;
        res.json({succ:"succ"}) ; 
    }catch(e){
        console.error(e) ; 
        res.json({error:"error"}) ; 
    }
}) ; */

/*router.delete("/deletedocument", protect, authorize("teacher"), async (req, res) => {
    try {
        const { id } = req.body;
        const media = await documents.findOne({ _id: id });
        if (!media) {
            return res.json({ error: "not found!" });
        }
        await b2.authorize();

        // Extract fileName from the stored URL
        const urlPath = new URL(media.url).pathname; // e.g. /file/bucketname/1234567890-myfile.pdf
        const fileName = urlPath.split('/').pop().split('?')[0]; // e.g. 1234567890-myfile.pdf

        await b2.deleteFileVersion({
            fileId: media.fileId,
            fileName: fileName,   // ← this was missing
        });

        await media.deleteOne();
        res.json({ succ: "succ" });
    } catch (e) {
        console.error(e);
        res.json({ error: "error" });
    }
});*/

module.exports = router ;