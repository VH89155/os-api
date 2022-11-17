const express = require('express');
const path = require('path');
const morgan = require('morgan');
var methodOverride = require('method-override')
const route = require('./routers/index');
const db = require('./config/db')

//connect DB
db.connect();
// app.use(morgan('combined'))
require("dotenv").config();
const app = express();
const port = 8080;
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
// Custom middleware

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Routes init
route(app);
app.listen(port, () =>
    console.log(` App listening at http://localhost:${port}`),
);
