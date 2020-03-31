const USERDB =
  'mongodb://数据库名称:密码@den1.mongo1.gear.host:27001/tfboy?authSource=tfboy';
const MAINDB =
  'mongodb://数据库名称:密码@ds147872.mlab.com:47872/tfboy?authSource=tfboy';
// 下面两个是聚合数据的appkey
const NewsAppKey = 'yours AppKey';
const WeatherKey = 'yours AppKey';
module.exports = {
  USERDB,
  MAINDB,
  NewsAppKey,
  WeatherKey
};