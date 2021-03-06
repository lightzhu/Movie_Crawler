const path = require('path')
const Router = require('koa-router')
const request = require('request')
const router = new Router()
const User = require('../mongoose/UserModel.js')

// 注册接口
router.post('/register', async (ctx, next) => {
  console.log(ctx.request.body)
  let light = new User({
    name: ctx.request.body.userName,
    pwd: ctx.request.body.pwd,
    password: ctx.request.body.password,
    hobby: ctx.request.body.hobby,
    date: Date.now()
  })
  let doc = await User.findOne({ name: ctx.request.body.userName }, function (
    err,
    docs
  ) {
    if (err) {
      console.log(err)
    }
  })
  if (doc) {
    ctx.body = {
      code: 200,
      msg: '用户名已存在！'
    }
    return false
  }
  let resp = await new Promise((resolve, reject) => {
    light.save(function (err, doc) {
      if (err) {
        reject(err)
      } else {
        resolve({
          code: 200,
          msg: '注册成功',
          user: ctx.request.body.userName
        })
      }
    })
  })
  ctx.body = resp
})
// 登陆接口
router.post('/login', async (ctx, next) => {
  // console.log(22)
  let name = ctx.request.body.userName
  let pwd = ctx.request.body.pwd
  await User.findOne({ name }, function (err, docs) {
    if (err) {
      console.log(err)
    } else {
      if (!docs) {
        ctx.body = {
          code: 200,
          msg: '用户名错误',
          statue: 1
        }
      } else {
        if (pwd !== docs.pwd) {
          ctx.body = {
            code: 200,
            msg: '密码错误',
            statue: 2
          }
        } else {
          ctx.body = {
            code: 200,
            msg: '登陆成功！',
            statue: 0,
            userId: docs._id,
            userName: docs.name
          }
        }
      }
    }
  })
})
//获取用户列表
router.get('/get_users', async ctx => {
  await User.find({}, null, { sort: { type: -1 } }, function (err, docs) {
    if (err) {
      ctx.body = {
        code: 202,
        msg: '获取数据失败'
      }
    } else {
      console.log(docs)
      ctx.body = {
        code: 200,
        msg: '获取成功',
        data: docs
      }
    }
  })
})
module.exports = router
