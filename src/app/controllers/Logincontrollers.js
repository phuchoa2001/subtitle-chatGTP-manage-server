const Login = require('./models/Logins')
const nodemailer = require("nodemailer");
class Logincontrollers  {
  // [GET] /login
  async index(req, res) {
    Login.find({}, function (err, data) {
      res.status(200).json(data)
    })
  }
  async verifyemail(req, res) { // xác nhận email 
    var cookies = req.body.cookies;
    var verifySMS = req.body.verifySMS;
    var Account = null;
    try {
    await Login.findOne({ cookies: cookies, verifySMS: verifySMS }, function (err, data) {
      Account = data
    })
      if (Account) {  
        Login.updateOne({ cookies: cookies, verifySMS: verifySMS }, { verifyEmail: true }).then();
        console.log("Email Success !")
        res.status(200).json({ messger: "Verify Email Success" });
      } else {
        console.log("Verify Email failure !")
        res.status(200).json({ messger: "Verify Email failure" });
      }
    }catch(err) {

    }
  }
  async checkaccount (req , res) { // Kiểm Trả Đăng ký tài khoản 
    const name = req.body.name ;
    const value = req.body.value ;
    var account ;
    try{
    if(name === "Username") {
      await  Login.findOne({Username:value} , (err , data) => {
         account = data;
      })
    }else {
      Login.findOne({Email:value} , (err , data) => {
        account = data;
     })
    }
    if(account) {
      res.status(200).json({messger : "already exist" })
    }else {
      res.status(200).json({messger : "not existed yet" })
    }
    }
    catch(err) {

    }
  }
  async api (req , res) {
    console.log("start data")
    try {
    Account = data;
    console.log("start data 2")
    await Login.find({} , function(err , data) {
      console.log(data);
      Account = data;
    })
    res.json(data);
  }catch(err){
    
  }

  }
  async getcookie(req , res) { // Client Cookie và lấy Tài khoản về 
     var cookies = req.body.cookies;
     var Account = null;
     try{
     await Login.findOne({cookies : cookies} , function(err , data) {
       console.log(data);
       Account = data;
     })
      console.log(Accounts)
        var  Accounts = {
          Username: Account.Username ,
          Email : Account.Email , 
          Password : Account.Password , 
          cookies : Account.cookies ,
          photobeer : Account.photobeer ,
          description : Account.description ,
          verifySMS : null , 
          avatar : Account.avatar ,
          verifyEmail : Account.verifyEmail
        }
        res.status(200).json(Accounts)
      }
      catch(err) {

      }
  }
  async login(req, res) { // Đăng nhập
    var Username = req.body.username ;
    var Password = req.body.password;
    var Account = null;
    try {
    await Login.findOne({Username : Username , Password: Password} , (err , data) => {
      console.log(data);
      Account = data;
      console.log( "Account" , Account);
    })
    if(Account) {
      var  Accounts = {
        Username: Account.Username ,
        Email : Account.Email , 
        Password : Account.Password , 
        cookies : Account.cookies ,
        verifySMS : null , 
        avatar : Account.avatar ,
        verifyEmail : Account.verifyEmail
      }
      res.status(200).json(Accounts)
    }else {
      res.status(200).json({messger : "password false"})
    }
    }catch(err) {

    }
  }
   regtration(req, res) { // đăng ký và gữi Gmail
    var body = req.body;
    var Email = body.Email
    var verifySMS = Math.floor(Math.random() * 1000000);
    body.verifySMS = verifySMS
    body.avatar = ''
    body.verifyEmail = false;
    var confirmEmailLink =  body.confirmEmailLink ;;
    const account = new Login(body);
    account.save();
    /// send gmail : 
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "chuthanhnam003@gmail.com", // generated ethereal user
        pass: "phuchoa00", // generated ethereal password
      },
    });
    var options = {
      form: "chuthanhnam003@gmail.com",
      to: Email,
      subject: `Tài Khoản của Bạn đã đăng ký tại https://xoanen.herokuapp.com/ 
          với Email: ${Email} nếu là bạn . hãy nhập mã này ${verifySMS} vào ứng dụng `,
      text: `Tài Khoản của Bạn đã đăng ký tại https://xoanen.herokuapp.com/ 
       với Email: ${Email} nếu là bạn . hãy nhập mã này ${verifySMS} vào ứng dụng  
       hoặc bạn có thể xác nhận email bằng link :http://localhost:3002/login/confirmEmail/${confirmEmailLink}`,
      html: "<a herf="/">HTML version of the message</a>"
    }
    transporter.sendMail(options, function (err, info) {
      if (err) {
        console.log(err)
      } else {
        console.log(info.response)
      }
    })
    body.verifySMS = null;
    body.confirmEmailLink = null;
    res.status(200).json(body);
  }
  async confirmemaillink (req , res){
     var link = req.body.link;
     var Account = null;
     try{
     await  Login.findOne({confirmEmailLink : link} , function(err , data) {
      Account = data
     })
      if (Account) {
        Login.updateOne({confirmEmailLink : link}, { verifyEmail: true }).then();
        console.log("Email Success !")
        res.status(200).json({ messger: "Verify Email Success" });
      } else {
        console.log("Verify Email failure !")
        res.status(200).json({ messger: "Verify Email failure" });
      }
  }
  catch(err) {

  }
  }
}
module.exports = new Logincontrollers;
