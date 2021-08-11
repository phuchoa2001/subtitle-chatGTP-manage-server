const sharp = require('sharp');
const path = require("path");
const Login = require("./models/Logins");
const port = "http://localhost:3001";
var cloudinary = require('cloudinary').v2
cloudinary.config({ 
  cloud_name: 'xoanen', 
  api_key: '774386681112683', 
  api_secret: 'jZeifLqmfUItgPg_qEzyvn07W6Y' 
});
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
        let url;
        await  cloudinary.uploader.upload(
          `${path.join(__dirname, `../../public/result-upload`)}${"\\" + req.file.filename}`, 
          {public_id: 'sample_remote'}, 
          function(error, result) { 
           url = result.url;
          }
        );
        Login.updateOne({cookies : cookies} , {avatar : url }).then();
        res.status(200).json({urlavatar:url}); 
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
        let url;
        await  cloudinary.uploader.upload(
          `${path.join(__dirname, `../../public/result-upload`)}${"\\" + req.file.filename}`, 
          {public_id: 'sample_remote'}, 
          function(error, result) { 
           url = result.url;
          }
        );
        console.log(url);
        Login.updateOne({cookies : cookies} , {photobeer : url }).then();
        res.status(200).json({urlbeer:url});
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