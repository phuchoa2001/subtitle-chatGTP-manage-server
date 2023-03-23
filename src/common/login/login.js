const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const userSchema = require("../../schema/users");

const { JWT_SECRET } = require("../../contants/jwt");

const login = async (req, res) => {
	// Lấy thông tin đăng nhập từ yêu cầu
	let { username, password } = req.body;

	// chuyển username thành chữ thường
	username = username.toLowerCase();

	// Tìm người dùng theo username và password
	const user = await userSchema.findOne({ username });

	// Nếu tìm thấy người dùng, tạo JWT và trả về cho người dùng
	if (user) {
		bcrypt.compare(password, user.password, function (err, result) {
			if (err) {
				// Xử lý lỗi
				res.status(500).json({ message: 'Lỗi server !' });
			} else if (result) {
				// Mật khẩu đúng
				const options = {
					expiresIn: '7d' // Thời gian sống của token, có thể là một chuỗi đại diện cho thời gian, ví dụ '1h', '7d', '30m',...
				};

				const token = jwt.sign({ ...user["_doc"] , id : user.id}, JWT_SECRET, options);
				res.json({ token , user });
			} else {
				// Mật khẩu sai
				res.status(404).json({ message: 'Mật khẩu sai !' });
			}
		});

	} else {
		// Nếu không tìm thấy người dùng, trả về mã lỗi 401 (Unauthorized)
		res.status(404).json({ message: 'Tên đăng nhập không tồn tại' });
	}
};

module.exports = login;