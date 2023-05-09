require('dotenv').config()

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')


const app = express();
app.use(cors());
app.options('*', cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/zkeys", express.static(path.join(__dirname, "zkeys")));
app.use("/log",express.static(path.join(__dirname,"otherfiles"),{index: "log.csv"}))

module.exports = app;