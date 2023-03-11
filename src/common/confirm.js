const { isAdmin : functionIsAdmin , isAuthenticated , noAuthenticated} = require("../middleware/jwt")

const confirm = ({ isAdmin, isLogin }) => {
  if(!isLogin && !isAdmin) {
    return noAuthenticated
    // Không cần đăng nhập
  }

  if(isLogin && !isAdmin) {
    return isAuthenticated
    // Phải đăng nhập
  }

  return functionIsAdmin;
  // Phải quyền admin
}

module.exports = confirm;