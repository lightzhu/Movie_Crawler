const Router = require('koa-router')
const router = new Router()
const mongoose = require('mongoose');
const formidable = require('formidable');
const grid = require('gridfs-stream');
const fs = require('fs');
// const util = require('util');
const Topic = require('../mongoose/TopicModel.js')
grid.mongo = mongoose.mongo;

//上传图片
router.post('/fileupload', async ctx => {
  let form = new formidable.IncomingForm();
  let temp_path = '';
  form.uploadDir = __dirname + "/upload";
  form.keepExtensions = true;
  let resp = await new Promise((resolve, reject) => {
    form.parse(ctx.req, function (err, fields, files) {
      console.log(files.file.path)
      temp_path = files.file.path
      if (!err) {
        console.log('File uploaded : ' + temp_path);
        let gfs = grid(ctx.db.db);
        let image_name = new Date().getTime() + files.file.name
        var writestream = gfs.createWriteStream({
          filename: image_name,
          size: files.file.size
        });
        fs.createReadStream(temp_path).pipe(writestream);
        const { title, username, user_id, content } = fields
        // console.log(fields)
        let topic = new Topic({
          title,
          username,
          user_id,
          content,
          image_name,
          date: Date.now()
        })
        topic.save(function (err, doc) {
          if (err) {
            reject(err)
          } else {
            resolve({
              code: 200,
              msg: '保存成功'
            })
          }
        })
      } else {
        reject(err)
      }
    });
    // 保存成功之后删除本地缓存
    form.on('end', function () {
      setTimeout(() => {
        fs.unlink(temp_path, function (error) {
          if (error) {
            console.log(error);
            return false;
          }
          console.log('删除文件成功');
        })
      }, 10000)
    });
  })
  if (resp) {
    ctx.body = resp
  }
})
//获取图片文件
const getImage = (docs, ctx) => {
  let gfs = grid(ctx.db.db);
  let allPromise = docs.map((item) => {
    return new Promise((resolve, reject) => {
      let readstream = gfs.createReadStream({
        filename: item.image_name
      })
      let arr = [];
      readstream.on('data', function (chunk) {  //chunk是buffer类型
        arr.push(chunk);
      })
      readstream.on('end', function (chunk) {
        resolve({
          _id: item._id,
          title: item.title,
          username: item.username,
          content: item.content,
          date: item.date,
          image_content: Buffer.concat(arr)
        })
      })
      // 监听错误
      readstream.on('error', function (err) {
        reject(err)
        console.log(err);
      })
    })
  })
  return allPromise
}

router.get('/getTopics', async ctx => {
  let docs = await Topic.find({}, null, { sort: { date: 1 }, limit: 30 }, function (err, docs) {
    if (err) {
      ctx.body = {
        code: 202,
        msg: '获取数据失败'
      }
    }
  })
  if (docs) {
    await Promise.all(getImage(docs, ctx)).then((result) => {
      // console.log(result)
      ctx.body = {
        code: 200,
        msg: '获取成功',
        data: result
      }
    }).catch((error) => {
      console.log(error)
    })
  }
})

// let resp = await new Promise((resolve, reject) => {
//   // var fs_write_stream = fs.createWriteStream('./write.png');
//   // 读取文件
//   var readstream = gfs.createReadStream({
//     filename: '头部背景 (1).jpg'
//   });
//   // readstream.pipe(fs_write_stream);
//   // fs_write_stream.on('close', function () {
//   //   console.log('file has been written fully!');
//   // });
//   let arr = [];
//   readstream.on('data', function (chunk) {  //chunk是buffer类型
//     arr.push(chunk);
//   })
//   //监听文件读取完毕，会自动触发一次end事件，没有读取完是不会触发的
//   //Buffer.concat合并小buffer
//   readstream.on('end', function (chunk) {
//     console.log(Buffer.concat(arr));
//     resolve({
//       code: 200,
//       msg: '获取成功',
//       content: Buffer.concat(arr) //.toString()
//     })
//   })
//   // 监听错误
//   readstream.on('error', function (err) {
//     reject(err)
//     console.log(err);
//   })
// })
// ctx.body = resp


module.exports = router
