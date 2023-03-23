const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../contants/jwt");
const { PERMISSION } = require("../contants/permission");
const userSchema = require("../schema/users");

function noAuthenticated(req, res, next) {
  // Không cần đăng nhập
  next();
}

function isAdmin(req, res, next) {
  // Không có token
  if (!req.headers.authorization) {
    res.sendStatus(403);
  }

  // Lấy token từ tiêu đề yêu cầu
  const token = req.headers.authorization.split(' ')[1];

  // Giải mã token để lấy thông tin người dùng
  const decodedToken = jwt.verify(token, JWT_SECRET);

  // Kiểm tra xem người dùng có quyền quản trị viên hay không
  if (decodedToken.permission === PERMISSION.admin) {
    // Nếu có quyền, tiếp tục xử lý yêu cầu
    next();
  } else {
    // Nếu không có quyền, trả về lỗi 403 (Không được phép truy cập)
    res.sendStatus(403);
  }
}

function isAuthenticated(req, res, next) {
  // Không có token
  if (!req.headers.authorization) {
    res.sendStatus(401);
  }

  // Lấy token từ tiêu đề yêu cầu
  const token = req.headers.authorization.split(' ')[1];

  // Nếu không có token, trả về lỗi 401 (Chưa được xác thực)
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    // Giải mã token để lấy thông tin người dùng
    const decodedToken = jwt.verify(token, JWT_SECRET);

    next();
  } catch (err) {
    // Nếu token không hợp lệ, trả về lỗi 401 (Chưa được xác thực)
    res.sendStatus(401);
  }
}

function verifyToken(req, res, next) {
  try {

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.id = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { isAdmin, isAuthenticated, noAuthenticated, verifyToken };