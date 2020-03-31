const Router = require('koa-router')
const MovieDetail = require('../mongoose/MovieListModel.js')
const router = new Router()
router.get('/page', async ctx => {
  // console.log(ctx.db)
  let html = `
    <ul>
      <li><a href="/page/helloworld">/page/helloworld</a></li>
      <li><a href="/page/404">/page/404</a></li>
    </ul>
  `
  ctx.body = 'fdsfsdfsd'
})
//获取电影列表
router.get('/get_movies', async ctx => {
  let page = parseInt(ctx.query.page)
  let size = parseInt(ctx.query.size)
  await MovieDetail.find({}, null, { sort: { type: -1 }, skip: 10 * page, limit: size }, function (err, docs) {
    if (err) {
      ctx.body = {
        code: 202,
        msg: '获取数据失败'
      }
    } else {
      ctx.body = {
        code: 200,
        msg: '获取成功',
        data: docs
      }
    }
  })
})
module.exports = router
