const Router = require('koa-router')
const request = require('request')
const { NewsAppKey, WeatherKey } = require('../dbConfig.js')
const router = new Router()
router.get('/get_news', async ctx => {
  console.log(ctx.query)
  let type = ctx.query.type
  let resp = await new Promise((resolve, reject) => {
    request(
      {
        method: 'get',
        url: `http://v.juhe.cn/toutiao/index?type=${type}&key=${NewsAppKey}`
      },
      function (err, res) {
        if (err) {
          reject({
            code: 202,
            msg: '获取数据失败'
          })
          console.log(err)
        } else {
          resolve({
            code: 200,
            msg: '获取成功',
            data: JSON.parse(res.body).result.data
          })
        }
      }
    )
  })
  ctx.body = resp
})
function getWeather(city) {
  return new Promise(function (resolve, reject) {
    let options = {
      method: 'get',
      url: `http://apis.juhe.cn/simpleWeather/query?city=
      ${encodeURI(city)}
      &key=${WeatherKey}`,
      encoding: null
    }
    request(options, function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}
router.get('/get_weatherInfo', async ctx => {
  let city = ctx.query.city
  await getWeather(city).then(function (data) {
    const res = JSON.parse(data.body.toString())
    if (res.reason !== '查询成功!') {
      ctx.body = {
        code: 202,
        msg: '获取数据失败'
      }
    } else {
      ctx.body = {
        code: 200,
        msg: '获取成功',
        data: res.result
      }
    }
  })
})
module.exports = router
