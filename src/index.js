const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const dotenv = require("dotenv");
const http = require('http');
const app = express();
const server = http.createServer(app);
dotenv.config();
const route = require('./routers')
const db = require('./config/db')
const methodOverride = require('method-override')
app.use(methodOverride('X-HTTP-Method-Override'))
dotenv.config();
//conneact DB
db.connect();
app.use(cors())
app.use(morgan('combined'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json({limit: '500mb'}));
app.use(express.urlencoded({limit: '500mb', extended: true, parameterLimit: 50000}));

route(app);

server.listen(process.env.PORT || 3001, () => {
  console.log('Server đang chay tren cong ' + process.env.PORT);
  console.log("app");
});