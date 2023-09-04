const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const cloudinary = require("cloudinary").v2;
const Path = require("../path");
const pathNodejs = require('path');

const getList = require("../common/public/getList");
const getId = require("../common/public/getId");
const post = require("../common/public/post");
const put = require("../common/public/put");
const deleteItem = require("../common/public/delete");
const increaseView = require("../common/public/increaseView");

// login 
const register = require("../common/login/register");
const login = require("../common/login/login");
const protected = require("../common/login/protected");

// Function
const confirm = require("../common/confirm");

const { isAdmin, verifyToken } = require("../middleware/jwt")

const { PERMISSION } = require("../contants/permission");
const { JWT_SECRET } = require("../contants/jwt");
const { SALTROUNDS } = require("../contants/bcrypt");

const userSchema = require("./schema/users");
const subtitleoutstandingSchema = require("./schema/subtitleoutstanding");
const subtitleDoneSchema = require("./schema/subtitledone");
const subtitleWaitingSchema = require("./schema/subtitlewaiting");
const fileSchema = require("./schema/file");
const { v4: uuidv4 } = require('uuid');

const LIST_STATUS = {
	done: "done",
	waiting: "waiting"
}

const AccountAdmin = {
	username: "Phuchoa",
	age: 22,
	password: "admin",
	email: "phuchoa1202@gmail.com",
	permission: PERMISSION.admin
}

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

function getElementsAroundIndex(array, index) {
	const start = Math.max(0, index - 8);
	const end = Math.min(array.length, index + 9); // +1 because slice() does not include end index

	return {
		before: array.slice(start, index),
		after: array.slice(index + 1, end),
	};
}
const doneTask = async (req, res) => {
	const elemtOutStanding = await subtitleoutstandingSchema.findOne({});
	const product = await subtitleDoneSchema.create({
		data: elemtOutStanding.data,
		name: elemtOutStanding.name
	});
	await subtitleWaitingSchema.deleteMany({ name: elemtOutStanding.name });

	const elemtOne = await subtitleWaitingSchema.findOne({}, null, { sort: { _id: 1 } });
	if (!elemtOne) {
		const result = await subtitleoutstandingSchema.deleteMany({ name: elemtOutStanding.name });
	} else {
		await subtitleoutstandingSchema.findByIdAndUpdate(elemtOutStanding["_id"], {
			data: elemtOne.data,
			name: elemtOne.name
		}, { new: true });
	}
	res.json(product);
}

function route(app) {
	app.get("/", (req, res) => {
		res.send('xin chào');
	})

	// Upload File 
	app.post(`/upload`, async (req, res) => {
		const { name, url } = req.body;
		const extension = pathNodejs.extname(name);
		const public_id = uuidv4();
		await cloudinary.uploader.upload(url, { public_id: public_id + extension, resource_type: "raw" },
			function (error, result) {
				console.log("result" , result , error);
				if (result) {
					const module_obj = {
						public_id: result.public_id,
						name: name,
						format: extension,
						url: result.url,
					};
					res.json(module_obj);
				} else {
					res.json({ payload: "error" });
				}
			}
		);
	})

	app.get('/reset', async (req, res) => {
		try {
			const result = await subtitleWaitingSchema.deleteMany({});
			const result2 = await subtitleDoneSchema.deleteMany({});
			res.json({ message: 'reset' });
		} catch (err) {
			console.error(err);
			res.status(500).json({ success: false, message: err.message });
		}
	});

	Path.forEach(item => {
		const { router, isAdmin, isLogin, allowPublic } = item;
		const nextFun = confirm({ isAdmin, isLogin });

		if (item.routerMore) {
			item.routerMore(app, { nextFun }, item);
		}

		app.get(`${item.router}`, nextFun, (req, res) => {
			getList(req, res, item.schema, item.populates, item.fieldSearch)
		})
		app.get(`${router}/:id`, nextFun, (req, res) => {
			getId(req, res, item.schema, item.populates)
		})
		app.post(`${router}`, nextFun, (req, res) => {
			post(req, res, item.schema, item.populates)
		})
		app.put(`${router}/:id`, nextFun, (req, res) => {
			put(req, res, item.schema, item.populates)
		})
		app.delete(`${router}`, nextFun, (req, res) => {
			deleteItem(req, res, item.schema)
		})

		// Public
		if (allowPublic) {
			app.get(`/public${item.router}`, (req, res) => {
				getList(req, res, item.schema, item.populates)
			})
			app.get(`/public${router}/:id`, (req, res) => {
				getId(req, res, item.schema, item.populates)
			})
			app.put(`/public${router}/:id/increaseView`, (req, res) => {
				increaseView(req, res, item.schema)
			})
		}
	})

	app.get("/subtitle/done", doneTask)

	// Tạo tài khoản Admin 
	// app.post('/registerAdmin', async (req, res) => {
	// 	const token = jwt.sign(AccountAdmin, JWT_SECRET);
	// 	const hashedPassword = bcrypt.hashSync(AccountAdmin.password, SALTROUNDS);

	//     AccountAdmin.token = token;
	// 	AccountAdmin.password = hashedPassword;

	// 	const user = await userSchema.create(AccountAdmin);
	// 	res.status(201).json(user);
	// })
	// JSON Web Tokens
	app.post('/register', isAdmin, register)
	app.post('/login', login)
	app.post('/protected', verifyToken, protected)
	app.post('/profile', verifyToken, protected)

	// viết nhận việc và trả việc 
	app.post("/acceptJob", async (req, res) => {
		const { permission } = req.body;

		const dataWithPermission = await subtitleWaitingSchema.findOne({ permission: permission }).exec();

		const data = dataWithPermission || await subtitleWaitingSchema.findOne({ permission: { $exists: false } }).exec();

		if (!data) {
			res.json({
				data: null
			})
			return;
		}

		let firstItem = null;
		var currentTime = new Date();
		let indexFirstTem = null;

		for (var i = 0; i < data.data.length; i++) {
			var currentItem = data.data[i];
			let targetTime = currentTime;

			if (currentItem.time?.getTime) {
				targetTime = currentItem.time?.getTime() + (10 * 60000);
			}

			if (
				(!currentItem.permission && !currentItem.status) ||
				(currentItem.permission === permission && currentItem.status === LIST_STATUS.waiting) ||
				(targetTime <= currentTime && currentItem.status !== LIST_STATUS.done)
			) {
				firstItem = currentItem;
				indexFirstTem = i;
				break;
			}
		}

		if (!firstItem) {
			res.json({
				data: null
			});
			return
		}

		const { before, after } = getElementsAroundIndex(data.data, indexFirstTem);

		const resultItem = {
			...firstItem,
			permission: permission,
			idSub: Math.random(),
			idFile: data["_id"],
			time: currentTime,
			before: before.map((item) => item.text).join(","),
			after: after.map((item) => item.text).join(","),
			status: LIST_STATUS.waiting
		}

		const newData = [...data.data];

		newData[indexFirstTem] = resultItem;

		subtitleWaitingSchema.findByIdAndUpdate(data["_id"], { data: newData, permission }, { new: true }).then((updatedData) => {
			res.json({
				data: resultItem
			});
		})
	});

	app.post("/doneJob", async (req, res) => {
		const { idFile, data } = req.body;

		const dataBD = await subtitleWaitingSchema.findOne({ _id: idFile }).exec();

		const newData = [...dataBD.data];
		const index = newData.findIndex((item) => item.idSub === data.idSub)

		const resultItem = {
			...data,
			status: LIST_STATUS.done
		}
		newData[index] = resultItem;

		subtitleWaitingSchema.findByIdAndUpdate(idFile, { data: newData }, { new: true }).then(async (updatedData) => {
			if (newData.every(item => item.status === LIST_STATUS.done)) {
				const product = await subtitleDoneSchema.create({
					data: newData,
					name: dataBD.name,
					courseName : dataBD.courseName
				});
				await subtitleWaitingSchema.deleteMany({ _id: idFile });
				res.json(product);
				return;
			};

			res.json({
				data: resultItem
			});
		})

	})
}
module.exports = route;