const mongoose = require("mongoose")                               //import mongoose
const contactModel = require("../models/contactModel")             //import contacModel
const jwt = require("jsonwebtoken")                                //import Json web token for authenticatio


const addContact = async function (req, res) {

    let data = req.body
    let { Name, Phone } = data             //destructure data

    if (Object.keys(data).length == 0) {           //convert keys of object into array to find the length
        return res.status(400).send({ status: false, message: "body not present" })
    }
    if (!Name) {                                                                           //check name is given or not
        return res.status(400).send({ status: false, message: "Name is required" })
    }
    let duplicates = await contactModel.findOne({ Name: Name })                         //check name is present or not in the database 
    if (duplicates.Name) {
        return res.status(400).send({ status: false, message: "name is already exists" })
    }
    if (duplicates.Phone) {
        return res.status(400).send({ status: false, messagee: "phone is already exists" })
    }
    let savedData = await contactModel.create(data)                                     //cretae Data
    return res.status(201).send({ status: true, data: savedData })

}
//==========================================Login=============================================
const login = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "credentials not present " })
        }
        let { Name, Phone } = data
        if (!Name) {
            return res.status(400).send({ status: false, message: "name is required" })
        }
        if (!Phone) {
            return res.status(400).send({ status: false, message: "phone is required" })
        }
        let check = await contactModel.findOne({ Name: Name })
        if (!check || check.isDeleted == true) {
            return res.status(404).send({ status: false, message: "resource not found" })
        }
        if (Phone != check.Phone) {
            return res.status(404).send({ status: false, message: "password is incorrect" })
        }
        const token = jwt.sign(                            //generate JWT 
            {
                contactId: check._id.toString(),           // pay Load
                contactStaus: "active"

            },
            "address book system"                          // secreate key
        )
        return res.status(200).send({ status: true, data: { token: token } })
    } catch (error) {
        return res.status(500).send({ status: false, message: error })
    }

}
//===========================================getContact===================================================================

const getSingleContact = async function (req, res) {
    try {
        let data = req.query
        let name = data.Name
        let phone = data.Phone
        if (!data) {
            return res.status(400).send({ status: false, message: "query must be required" })
        }
        if (!name || !phone) {
            return res.status(400).send({ status: false, message: "name or phone is not present" })
        }


        let findData = await contactModel.findOne({ $or: [{ Name: name }, { Phone: phone }] })
        if (!findData || findData.isDeleted == true) {
            return res.status(404).send({ status: false, message: "resource not found" })
        } else {
            return res.status(200).send({ status: true, message: findData })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error })
    }

}
//==============================================updateContact==============================================================
const updateContact = async function (req, res) {
    try {
        let contactName = req.query.Name
        if (!contactName) {
            return res.status(400).send({ status: false, message: "query must be required" })
        }
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: " all feilds mandatory" })
        }
        let name = data.Name
        let phone = data.Phone
        if (!name) {
            return res.status(400).send({ status: false, message: "name must be required" })
        }
        if (!phone) {
            return res.status(400).send({ status: false, message: "phone must be required" })
        }

        let update = await contactModel.findOneAndUpdate({ Name: contactName }, { $set: { Name: name, Phone: phone } }, { new: true })
        if (!update) {
            return res.status(404).send({ status: false, message: "resource not found" })
        } else {
            return res.status(200).send({ status: true, data: update })
        }


    } catch (error) {
        return res.status(500).send({ status: false, message: error })
    }

}
//======================================deleteContact==================================================================
const deleteContact = async function (req, res) {
    let name = req.query.Name
    if(!name){
        return res.status(400).send({status:false,message:"query must be required"})
    }
    let contactDeleted = await contactModel.findOneAndUpdate({ Name: name }, { $set: { isDeleted: true } }, { new: true })
    if(!contactDeleted || contactDeleted.isDeleted == true){
        return res.status(404).send({status:false,message:"resource not found"})
    }
    return res.status(200).send({status:true,message:contactDeleted})
}



module.exports = { addContact, getSingleContact, updateContact, deleteContact, login }