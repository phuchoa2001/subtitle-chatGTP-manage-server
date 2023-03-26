const user = require("../schema/users");
const blog = require("../schema/blogs");
const category = require("../schema/category");
const bookshop = require("../schema/bookshop")
const permission = require("../schema/permission")
const image = require("../schema/images");

const Path = [
	{
		router : "/users" ,
		schema : user,
		populates : [],
		isAdmin : true,
		isLogin : true , 
		fieldSearch : ["username" , "email"],
		allowPublic : false
	},
	{
		router : "/permission" ,
		schema : permission,
		populates : [],
		isAdmin : true,
		isLogin : true,
		fieldSearch : ["username" , "email"],
		allowPublic : false
	},
	{
		router : "/blogs" ,
		schema : blog,
		populates : ["category , bookshop"],
		isAdmin : false,
		isLogin : true , 
		fieldSearch : ["username" , "email"],
		allowPublic : true
	},
	{
		router : "/categorys" ,
		schema : category,
		populates : [],
		isAdmin : false,
		isLogin : true , 
		fieldSearch : ["username" , "email"],
		allowPublic : true
	},
	{
		router : "/bookshops" ,
		schema : bookshop,
		populates : [],
		isAdmin : false,
		isLogin : true , 
		fieldSearch : ["username" , "email"],
		allowPublic : false
	},
	{
		router : "/images" ,
		schema : image,
		populates : [],
		isAdmin : false,
		isLogin : true , 
		allowPublic : true
	}
]

module.exports = Path;