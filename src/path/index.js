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
    }
  },
]

module.exports = Path;