var express = require('express');
var app = express();
const fs = require('fs')
const pathLib = require('path')
// 引入body-parser中间件，用来处理post请求体body中的数据
const bodyParser = require('body-parser')
// 引入multer中间件，用于处理上传的文件数据
const multer = require('multer')

// 配置 cors 这个中间件
const cors = require('cors')

const host = 'localhost';


const server = app.listen(3000, function () {
    console.log('express + multer 实现文件上传')
})




app.get('/', function (res, rep) {
    rep.send('Hello, word!');
});

app.use(cors())
// 读取静态资源
app.use(express.static('public'))
// 通过配置multer的dest属性， 将文件储存在项目下的tmp文件中
app.use(multer({dest: './public/'}).any())

// 访问index.html页面
app.get('/index.html', function (req, res) {
    // 将public下的index.html文件返回去
    res.sendFile(__dirname + '/index.html')
})

// 文件上传接口
app.post('/fileUpload', function (req, res) {
    // 上传的文件在req.files中
    const filename = req.files[0].path + pathLib.parse(req.files[0].originalname).ext
    console.log(filename);
    fs.rename(req.files[0].path, filename, function (err) {
        if (err) {
            res.send(err)
        } else {
            res.setHeader('Access-Control-Allow-Origin','*');
            res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS,DELETE');
            res.setHeader('Access-Control-Allow-Headers','x-requested-with,content-type');

            res.send(JSON.stringify({
                "errno": 0, // 注意：值是数字，不能是字符串
                "data": {
                    "url": 'http://'+host+':3000/'+filename.replace('public\\', ''), // 图片 src ，必须
                    "alt": "yyy", // 图片描述文字，非必须
                    "href": "zzz" // 图片的链接，非必须
                }
            }))
        }
    })
})