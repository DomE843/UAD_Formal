const express = require('express');
const router = require('../router/router');
const bodyParser = require('body-parser');

const app = express();

app.use('../node_modules/', express.static('../node_modules/'));
app.use('../public/', express.static('../public/'));
// app.use('/storager/', express.static('./storager/'));
app.use('../router/', express.static('../router/'));
app.engine('html', require('express-art-template'));

//配置模板引擎和body-parser一定要在app.use(router)挂载路由之前
//parse application/json
app.use(bodyParser.json({limit: '50mb'})); //扩展json的传输上限
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(router);

app.listen(3000, ()=> {
  console.log('server is running...');
});