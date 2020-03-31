const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;
let Topic_Schema = new Schema(
  {
    username: String,
    title: String,
    user_id: String,
    content: String,
    type: String,
    image_name: String,
    date: Date
  },
  {
    versionKey: false
  }
);
module.exports = Model('topics', Topic_Schema);
