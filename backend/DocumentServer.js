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
        // fetch documents from DB
        const d = await documents.find({session : sessionid}).lean();

        // authorize B2 and generate fresh signed URLs for each file (in case stored tokens expired)
        await b2.authorize();

        const docsWithSigned = await Promise.all(d.map(async (doc) => {
            try{
                // extract filename from stored url if possible
                let fileName = null;
                if (doc.url) {
                    try{
                        const urlObj = new URL(doc.url);
                        const parts = urlObj.pathname.split('/');
                        fileName = parts.pop();
                        if (fileName && fileName.includes('?')) {
                            fileName = fileName.split('?')[0];
                        }
                    }catch(e){
                        // fallback: try last segment of the string
                        const parts = String(doc.url).split('/');
                        fileName = parts.pop().split('?')[0];
                    }
                }

                if (!fileName) return doc;

                const authResponse = await b2.getDownloadAuthorization({
                    bucketId: BUCKET_ID,
                    fileNamePrefix: fileName,
                    validDurationInSeconds: 60 * 60 * 24 // 1 day
                });

                const signedUrl = `https://f005.backblazeb2.com/file/${BUCKET_NAME}/${encodeURIComponent(fileName)}?Authorization=${authResponse.data.authorizationToken}`;

                return { ...doc, signedUrl };
            }catch(e){
                console.error('signed url generation failed for doc', doc._id, e);
                return doc; // return original doc if signing fails
            }
        }));

        res.json({succ:"fetched successfully" , documents:docsWithSigned}) ;
    }catch(e){
        console.log(e);
        res.json({ error: "error" });
    }
})



module.exports = router ;