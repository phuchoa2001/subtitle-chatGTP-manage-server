const exprees = require('express');
const router = exprees.Router();
const Logincontrollers = require("../../src/app/controllers/Postcontrollers")
router.post('/post' , Logincontrollers.post)
router.put('/etion/:id' , Logincontrollers.etion)
router.delete('/detele/:id' , Logincontrollers.detele)
router.put('/like/:id' , Logincontrollers.like)
router.put('/cmt/:id' , Logincontrollers.cmt)
module.exports = router;