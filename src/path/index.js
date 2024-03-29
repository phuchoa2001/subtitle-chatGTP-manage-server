const user = require("../routers/schema/users");
const blog = require("../routers/schema/blogs");
const category = require("../routers/schema/category");
const bookshop = require("../routers/schema/bookshop")
const permission = require("../routers/schema/permission")
const image = require("../routers/schema/images");
const musicFile = require("../routers/schema/musicFile");
const strings = require("../routers/schema/strings");
const roles = require("../routers/schema/roles");
const templatePrompts = require("../routers/schema/templatePrompts");
const cloudinary = require("cloudinary").v2;

const subtitleDone = require("../routers/schema/subtitledone");
const subtitlewaiting = require("../routers/schema/subtitlewaiting");
const subtitleoutstanding = require("../routers/schema/subtitleoutstanding");
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.YOUR_TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const chatId = 6299146884;

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
    fieldSearch: ["courseName", "name"],
    allowPublic: false
  },
  {
    router: "/subtitlewaiting",
    schema: subtitlewaiting,
    populates: [],
    isAdmin: false,
    isLogin: false,
    fieldSearch: ["courseName", "name"],
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
    router: "/node-telegram-bot-api",
    schema: image,
    populates: [],
    isAdmin: false,
    isLogin: false,
    allowPublic: false,
    routerMore: (app, action, item) => {
      app.get(`${item.router}` + '/chat', action.nextFun, async (req, res) => {
        bot.sendMessage(chatId, req.query.chat || 'Hoàn thành');
        res.json({ success: true })
      })
    }
  },
  {
    router: "/roles",
    schema: roles,
    populates: [],
    isAdmin: false,
    fieldSearch: ["name", "desc"],
    isLogin: false,
    allowPublic: true
  },
  {
    router: "/templatePrompts",
    schema: templatePrompts,
    populates: [],
    fieldSearch: ["name", "desc"],
    isAdmin: false,
    isLogin: false,
    allowPublic: true
  },
  {
    router: "/string",
    schema: strings,
    populates: ["role"],
    isAdmin: false,
    isLogin: false,
    allowPublic: false,
    routerMore: (app, action, item) => {
      app.get(`${item.router}/search`, async (req, res) => {
        const roleName = req.query.name;

        // Tìm kiếm role dựa trên tên mà không phân biệt chữ hoa và chữ thường
        const role = await roles.findOne({ name: new RegExp('^' + roleName + '$', 'i') });
        if (!role) {
          return res.status(404).json({ message: 'Role not found' });
        }

        // Tìm kiếm trong bảng strings dựa trên role ID
        const texts = await strings.find({ 'role': role._id });
        if (texts.length === 0) {
          return res.status(404).json({ message: 'No texts found for the given role name' });
        }

        res.json(texts);
      });
    }
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
      app.post(`${item.router}` + '/assign-file', action.nextFun, async (req, res) => {
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
            return res.status(404).json({ message: "Không tìm thấy tài liệu phù hợp", error: true });
          }

          file.processed_by = processed_by;
          file.assigned_at = new Date();
          file.status = 2;
          await file.save();
          res.send(`!wget -O test.mp3 ${file.file_path}`);

        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Lỗi máy chủ" });
        }
      });
      app.post(`${item.router}` + '/retrieve-file', action.nextFun, async (req, res) => {
        try {
          const { processed_by, processed_text } = req.body;

          let file = await item.schema.findOne({ processed_by, status: 2 });

          if (!file) {
            return res.status(404).json({ message: "Không tìm thấy tài liệu phù hợp", error: true });
          }

          file.processed_by = processed_by;
          file.assigned_at = new Date();
          file.status = 3;
          file.processed_text = processed_text;
          await file.save();
          res.send(file);

        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Lỗi máy chủ" });
        }
      });
    }
  },
]

module.exports = Path;