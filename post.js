const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const PostSchema = new Schema(
  {
    name: String,
    title: String,
    description: String,
    author: String,
    dateAdded: String,
    link: String
  }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Post", PostSchema);