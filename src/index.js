const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const handlebars  = require('express-handlebars');
const exphbs = require('express-handlebars');
const path = require('path')
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const route = require('./routers')
const db = require('./config/db')
const nodemailer = require("nodemailer");
const methodOverride = require('method-override')
app.use(methodOverride('X-HTTP-Method-Override'))
//conneact DB
db.connect(); 
app.use(cors())
app.use(morgan('combined'))
app.use(express.urlencoded())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.engine('hbs', handlebars({
  extname: '.hbs'
}));
route(app)
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));
app.listen( process.env.PORT || 3001 , () => {
    console.log('Server đang chay tren cong '+ process.env.PORT);
});
