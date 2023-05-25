const fs = require('fs');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  let p = new Promise((resolve, reject) => {
    res.render('index.html');
    resolve();
  }) 
  p.then((data) => {
  }, (err) => {
    console.log(err);
  });
});

router.post('/', (req, res) => {
  let date = new Date();
  let time = {'year': 0, 'month': 0, 'day': 0, 'hour': 0};
  time['year'] = date.getFullYear();
  time['month'] = date.getMonth() + 1;
  time['day'] = date.getDate();
  time['hour'] = date.getHours();
  time['minute'] = date.getMinutes();
  time['second'] = date.getSeconds();
  let currentVersion = time.year + '' + time.month + '' + time.day + '' + time.hour + '' + time.minute + '' + time.second; //记录当前版本号
  
  let data = JSON.stringify(req.body);
  
  fs.writeFile('../../storager/json/' + currentVersion + '.json', data, err => {
    if(err === null) {
      console.log('写入文件成功');
    } else {
      console.log('写入文件失败');
    }
  });
  res.send('保存json页'); //此处响应不能少不然会导致报错
});

router.post('/case', (req, res) => {
  fs.readFile("../../storager/json/ErrExample_Complex.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  })
});

router.post('/readServerDirectory', (req, res) => {
  //遍历目录
  fs.readdir("../../storager/json", (err, files) => {
    if (err) {
      res.end("Cannot find directory!")
    } else {
      let fileJson = {};
      for (let i=0; i<files.length; i++) {
        fileJson[i] = files[i];
      }
      res.json(fileJson);
    }
  });
});

router.post('/readServerFile', (req, res) => {
  let fileName = req.body.fileName;
  fs.readFile(`../../storager/json/${fileName}`, "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  })
});

module.exports = router;