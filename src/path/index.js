const user = require("../routers/schema/users");
const blog = require("../routers/schema/blogs");
const category = require("../routers/schema/category");
const bookshop = require("../routers/schema/bookshop")
const permission = require("../routers/schema/permission")
const image = require("../routers/schema/images");
const musicFile = require("../routers/schema/musicFile");
const cloudinary = require("cloudinary").v2;

const subtitleDone = require("../routers/schema/subtitledone");
const subtitlewaiting = require("../routers/schema/subtitlewaiting");
const subtitleoutstanding = require("../routers/schema/subtitleoutstanding");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const Path = [
  {
    router: "/users",
    schema: user,
    populates: [],
    isAdmin: true,
    isLogin: true,
    fieldSearch: ["username", "email"],
    allowPublic: false
  },
  {
    router: "/permission",
    schema: permission,
    populates: [],
    isAdmin: true,
    isLogin: true,
    fieldSearch: ["username", "email"],
    allowPublic: false
  },
  {
    router: "/bookshops",
    schema: bookshop,
    populates: [],
    isAdmin: false,
    isLogin: true,
    fieldSearch: ["username", "email"],
    allowPublic: false
  },
  {
    router: "/subtitledone",
    schema: subtitleDone,
    populates: [],
    isAdmin: false,
    isLogin: false,
    fieldSearch: ["username", "email"],
    allowPublic: false
  },
  {
    router: "/subtitlewaiting",
    schema: subtitlewaiting,
    populates: [],
    isAdmin: false,
    isLogin: false,
    fieldSearch: ["username", "email"],
    allowPublic: false
  },
  {
    router: "/subtitleoutstanding",
    schema: subtitleoutstanding,
    populates: [],
    isAdmin: false,
    isLogin: false,
    fieldSearch: ["username", "email"],
    allowPublic: false
  },
  {
    router: "/images",
    schema: image,
    populates: [],
    isAdmin: false,
    isLogin: true,
    allowPublic: true
  },
  {
    router: "/musicFile",
    schema: musicFile,
    populates: [],
    isAdmin: false,
    isLogin: false,
    allowPublic: true,
    routerMore: (app, action, item) => {
      app.delete(`${item.router}`, action.nextFun, async (req, res) => {
        try {
          const ids = req.body.ids;
          // Tìm kiếm các tệp trong cơ sở dữ liệu
          const files = await item.schema.find({ _id: { $in: ids } });

          // Xóa các tệp từ Cloudinary
          for (const file of files) {
            await cloudinary.uploader.destroy(file.file_id, { resource_type: "raw" });
          }

          // Xóa các tệp từ cơ sở dữ liệu
          const result = await item.schema.deleteMany({ _id: { $in: ids } });

          if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
          }
          res.json({ message: 'Xóa sản phẩm thành công' });
        } catch (err) {
          console.error(err);
          res.status(500).json({ success: false, message: err.message });
        }
      })
      app.post(`${item.router}` + '/assign-file', action.nextFun , async (req, res) => {
        try {
          const { processed_by } = req.body;

          // Tìm tài liệu có processed_by khớp và đang ở trạng thái 2
          let file = await item.schema.findOne({ processed_by, status: 2 });

          // Nếu không tìm thấy, tìm tài liệu ở trạng thái 2 và thời gian nhận việc hơn 3 tiếng
          if (!file) {
            const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
            file = await item.schema.findOne({ status: 2, assigned_at: { $lt: threeHoursAgo } });
          }

          // Nếu không tìm thấy, trả về tài liệu cũ nhất với trạng thái 1
          if (!file) {
            file = await item.schema.findOne({ status: 1 }).sort({ created_at: 1 });
          }

          if (!file) {
            return res.status(404).json({ message: "Không tìm thấy tài liệu phù hợp" , error : true });
          }
          
          file.processed_by = processed_by;
          file.assigned_at = new Date();
          file.status = 2;
          await file.save();
          res.json(file);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Lỗi máy chủ" });
        }
      });
    }
  },
]

module.exports = Path;