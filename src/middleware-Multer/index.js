const path = require('path')
const multer = require("multer");
const radomnumber = require("../common/RandomNumbers")
let diskStorage = multer.diskStorage({ // Cài đặt Multer
    destination: (req, file, callback) => {
      // Định nghĩa nơi file upload sẽ được lưu lại
      callback(null, path.join(__dirname, '../public/upload'));
    },
    filename: (req, file, callback) => {
      // ở đây các bạn có thể làm bất kỳ điều gì với cái file nhé.
      // Mình ví dụ chỉ cho phép tải lên các loại ảnh png & jpg
      let math = ["image/png", "image/jpeg" , "image/jpg"];
      if (math.indexOf(file.mimetype) === -1) {
        let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
        return callback(errorMess, null);
      }
      // Tên của file thì mình nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
      let filename = `${radomnumber()}${file.originalname}`;
      callback(null, filename);
    }
});
module.exports = multer({storage: diskStorage });
