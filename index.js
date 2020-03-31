const Koa = require('koa')
const path = require('path')
const compress = require('koa-compress')
const serve = require('koa-static')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors');
const registerRouter = require('./routes/index.js')
const { MAINDB } = require('./dbConfig.js')
const mongoose = require('mongoose')
const movieTask = require('./task/movieTask.js')

// 连接数据库
mongoose.connect(MAINDB, {
  useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  // we're connected!
  console.log('连接成功')
  //实体的实例化
})

// 创建一个Koa对象表示web app本身:
const app = new Koa()
const static = serve(path.join(__dirname) + '/public/')
app.use(static)
//将数据库链接对象挂载到上下文
app.context.db = db;
// 启用gzip
const options = { threshold: 2048 }
app.use(compress(options))

app.use(
  cors({
    origin: function (ctx) {
      const whiteList = ['http://localhost:3666']; //可跨域白名单
      // console.log(ctx.url)
      if (ctx.url.match('/^test/')) {
        return '*' // 允许来自所有域名请求
      }
      let url = ctx.header.referer.substr(0, ctx.header.referer.length - 1);
      if (whiteList.includes(url)) {
        return url //注意，这里域名末尾不能带/
      }
      return 'https://lightzhu.github.io'
    },
    credentials: true
  })
)
app.use(bodyParser())

// 加载路由中间件
app.use(registerRouter())

// 在端口监听:
console.log(process.env.NODE_ENV)
const port = process.env.PORT || '8090'
app.listen(port)

// 开始采集任务
movieTask.run()
console.log(`app started at port ${port}`)
