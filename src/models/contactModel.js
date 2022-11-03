const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema({
    Name : {
        type: String,
        required : true,
        unique: true
       
    },
    Phone:{
        type: String,
       required: true,
        unique: true
        
    },
    isDeleted:{
        type:Boolean,
        default: false
    }
},{timestamps:true})

module.exports = mongoose.model("Contact",contactSchema)