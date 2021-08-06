const sharp = require('sharp');
const path = require("path");
const Login = require("./models/Logins");
const { json } = require('express');
const imgur = require('imgur');
const port = "http://localhost:3001";
class Profilecontrollers {
    async updateavatar(req, res) { // Up ảnh Đại diện
        const cookies = req.body.cookies;
        // req.file is the `avatar` file
        // req.body will hold the text fields, if there were any
        //Đổi ảnh bằng cookie 
        if(req.file){
       await sharp(req.file.path)
        .resize({width: 100, height: 100})   
        .toFile(`${path.join(__dirname, `../../public/result-upload`)}${"\\" + req.file.filename}`);
        const url = await imgur.uploadFile(`${path.join(__dirname, `../../public/result-upload`)}${"\\" + req.file.filename}`);
        Login.updateOne({cookies : cookies} , {avatar : url.link }).then();
        res.status(200).json({urlavatar:url.link}); 
        }
        else{
         res.status(200).json();
        }
    }
    async updatebeerphoto(req, res) { // Up ảnh Ảnh đại diện
        const cookies = req.body.cookies;
        // req.file is the `avatar` file
        // req.body will hold the text fields, if there were any
        //Đổi ảnh bằng cookie 
        if(req.file){
       await sharp(req.file.path)
        .resize({width: 400, height: 375})   
        .toFile(`${path.join(__dirname, `../../public/result-upload`)}${"\\" + req.file.filename}`);
        const url = await imgur.uploadFile(`${path.join(__dirname, `../../public/result-upload`)}${"\\" + req.file.filename}`);
        Login.updateOne({cookies : cookies} , {photobeer : url.link }).then();
        res.status(200).json({urlbeer:url.link});
        }else{
         res.status(200).json();
        }
    }
    updatedescrpit(req , res) {
        const text = req.body.newdescrpition;
        const cookies = req.body.cookies;
        if(req.body.newdescrpition  != "") {
        Login.updateOne({cookies : cookies} , {description : text }).then();
        res.status(200).json({text:text})
        }else{
         res.status(200).json();
        }
    }
    async changepassword(req , res) {
       console.log(req.body);
       const cookies = req.body.cookies ;
       const passwordold = req.body.passwordold;
       const passwordnew = req.body.passwordnew ;
       var Account = null;
       try {
       await Login.findOne({cookies : cookies , Password : passwordold} , function(err , data) {
         console.log(data)
         Account = data;
       });
        if (Account) {
            Login.updateOne({cookies : cookies} , {Password :passwordnew }).then();
          res.status(200).json({ messger: "thay đổi mật khẩu thành công" });
        } else {
          res.status(200).json({ messger: "Mất khẩu có bạn bị sai" });
        }
      }catch(err) {
        
      }
    }
}
module.exports = new Profilecontrollers;