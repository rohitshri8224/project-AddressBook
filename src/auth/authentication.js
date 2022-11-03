const jwt = require("jsonwebtoken")
const contactModel = require("../models/contactModel")


const verifyToken = async function(req,res,next){
    let token = req.headers["x-api-key"]
    if(!token){
        return res.status(401).send({status:false,message:"token must be require"})
    }
    let verify = jwt.verify(token,"address book system")

    let verifyId = verify.contactId
    let checkId = await contactModel.findById(verifyId)
    if(!checkId ){
        return res.status(404).send({status:false,message:"contact not found"})

        
    }next()
    
    
}
module.exports.verifyToken = verifyToken