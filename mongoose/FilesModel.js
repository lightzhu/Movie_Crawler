const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;
var FilesSchema = new Schema({
  filename: String,
  metadata: String,
  aliases: String
}, { collection: "fs.files", versionKey: "" });

module.exports = Model('TopicFile', FilesSchema);
