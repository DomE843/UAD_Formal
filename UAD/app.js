const express = require('express');
const router = require('./router/router');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

app.use('/node_modules/', express.static('/node_modules/'));
app.use('/public/', express.static('/public/'));
app.use('/storager/', express.static('/storager/'));
app.use('/router/', express.static('/router/'));

app.engine('html', require('express-art-template'));

//配置模板引擎和body-parser一定要在app.use(router)挂载路由之前
//parse application/json
app.use(bodyParser.json({limit: '50mb'})) //扩展json的传输上限
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser('sessionf'));
app.use(session({
  secret: "sessionf",
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }
}));
app.use(router);

app.listen(3000, ()=> {
  console.log('server is running...\nAccess by 127.0.0.1:3000');
});