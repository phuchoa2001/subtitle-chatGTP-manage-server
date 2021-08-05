const exprees = require('express');
const router = exprees.Router();
const Logincontrollers = require("../../src/app/controllers/Logincontrollers")
router.post('/regtration' , Logincontrollers.regtration)
router.post('/checkaccount' , Logincontrollers.checkaccount)
router.put('/verifyemail' , Logincontrollers.verifyemail)
router.post('/' , Logincontrollers.login)
router.post('/getcookie' , Logincontrollers.getcookie)
router.put('/confirmemaillink' , Logincontrollers.confirmemaillink)
module.exports = router;