const user = require("../schema/users");
const blog = require("../schema/blogs");
const category = require("../schema/category");
const bookshop = require("../schema/bookshop")
const permission = require("../schema/permission")
const image = require("../schema/images");

const subtitleDone = require("../schema/subtitledone");
const subtitlewaiting = require("../schema/subtitlewaiting");
const subtitleoutstanding = require("../schema/subtitleoutstanding");

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
		router : "/bookshops" ,
		schema : bookshop,
		populates : [],
		isAdmin : false,
		isLogin : true , 
		fieldSearch : ["username" , "email"],
		allowPublic : false
	},
	{
		router : "/subtitledone" ,
		schema : subtitleDone,
		populates : [],
		isAdmin : false,
		isLogin : false , 
		fieldSearch : ["username" , "email"],
		allowPublic : false
	},
	{
		router : "/subtitlewaiting" ,
		schema : subtitlewaiting,
		populates : [],
		isAdmin : false,
		isLogin : false , 
		fieldSearch : ["username" , "email"],
		allowPublic : false
	},
	{
		router : "/subtitleoutstanding" ,
		schema : subtitleoutstanding,
		populates : [],
		isAdmin : false,
		isLogin : false , 
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