const user = require("../routers/schema/users");
const blog = require("../routers/schema/blogs");
const category = require("../routers/schema/category");
const bookshop = require("../routers/schema/bookshop")
const permission = require("../routers/schema/permission")
const image = require("../routers/schema/images");

const subtitleDone = require("../routers/schema/subtitledone");
const subtitlewaiting = require("../routers/schema/subtitlewaiting");
const subtitleoutstanding = require("../routers/schema/subtitleoutstanding");

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
    allowPublic: false,
    routerMore: (app, action , item) => {
      app.get(`${item.router}/:id`, action.nextFun, (req, res) => {
        getId(req, res, item.schema, item.populates)
      })
    }
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
  }
]

module.exports = Path;