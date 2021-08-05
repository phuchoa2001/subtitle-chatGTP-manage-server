const LoginRouter = require('./login')
const ProfileRouter = require('./profile')
function route (app) {
    app.get("/" , (req , res) => {
        res.render("home");
    })
    app.use("/login" , LoginRouter)
    app.use("/profile" , ProfileRouter)
} 
module.exports = route ;