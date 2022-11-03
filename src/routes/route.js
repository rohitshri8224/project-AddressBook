const express = require('express');
const router = express.Router()
const contactControlller = require("../controllers/contactController")
const auth = require("../auth/authentication")

router.post("/save",contactControlller.addContact)
router.post("/login",contactControlller.login)
router.get("/search",contactControlller.getSingleContact)
router.put("/update",contactControlller.updateContact)
router.delete("/delete",auth.verifyToken,contactControlller.deleteContact)

module.exports = router