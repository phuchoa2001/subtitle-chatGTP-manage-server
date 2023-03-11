const userSchema = require("../../schema/users");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const { SALTROUNDS } = require("../../contants/bcrypt");
const { JWT_SECRET } = require("../../contants/jwt");

const register = async (req, res) => {
  // Lấy thông tin đăng ký từ yêu cầu
  let { username, password } = req.body;

  // chuyển username thành chữ thường
  username = username.toLowerCase();
  req.body.username = username.toLowerCase();

  // Kiểm tra xem người dùng đã tồn tại hay chưa
  const userExists = await userSchema.findOne({ username });

  // Nếu người dùng đã tồn tại, trả về mã lỗi 409 (Conflict)
  if (userExists) {
    res.status(409).send('Tên đăng nhập đã được sử dụng');
  } else {
    // Tạo tài khoản mới
    const hashedPassword = bcrypt.hashSync(password, SALTROUNDS);

    try {
      const user = await userSchema.create({
        ...req.body,
        password: hashedPassword
      });
     
      const options = {
        expiresIn: '7d' // Thời gian sống của token, có thể là một chuỗi đại diện cho thời gian, ví dụ '1h', '7d', '30m',...
      };

      // Phát hành JWT cho người dùng mới đăng ký
      const token = jwt.sign(req.body, JWT_SECRET , options);
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = register;