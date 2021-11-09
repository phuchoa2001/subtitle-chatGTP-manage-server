const LoginRouter = require('./login')
const ProfileRouter = require('./profile')
const PostRouter = require('./post')
const XoaNenRouter = require('./xoanen')
function route (app) {
    app.get("/" , (req , res) => {
        res.render("home");
    })
    app.use("/login" , LoginRouter)
    app.use("/profile" , ProfileRouter)
    app.use("/post", PostRouter)
    app.use("/xoanen" , XoaNenRouter)
} 
module.exports = route ;