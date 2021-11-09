const exprees = require('express');
const router = exprees.Router();
const upload = require("../middleware-Multer/index")
const Xoanen = require("../app/controllers/xoanencontrollers")
router.post('/' , upload.single('avatar') ,  Xoanen.index)
module.exports = router;