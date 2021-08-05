const exprees = require('express');
const router = exprees.Router();
const upload = require("../middleware-Multer/index")
const Profile = require("../../src/app/controllers/Profilecontrollers")
router.put('/updateavatar' , upload.single('avatar') ,  Profile.updateavatar)
router.put('/updatebeerphoto' , upload.single('avatar') ,  Profile.updatebeerphoto)
router.put('/updatedescrpit' , upload.single('avatar') ,  Profile.updatedescrpit)
router.put('/changepassword' , upload.single('avatar') ,  Profile.changepassword)
module.exports = router;