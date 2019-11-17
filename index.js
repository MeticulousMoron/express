const mongoose = require("mongoose");
const express = require("express");
var cors = require('cors');
const Data = require("./data");
const Post = require("./post");
const bodyParser = require("body-parser");
const countries = require("./resources/list_of_countries.json")
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute = "mongodb://localhost:27017/nodedb";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});


router.get("/getCountries", (req, res) => {
  console.log("Request recieved for countries");
    return res.json({ success: true, data: countries });
});


// this is our update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Data.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res) => {
  let data = new Data();

  const { id, message } = req.body;
console.log("This is the request " + id + " " + message);
  // if ((!id && id !== 0) || !message) {
  //   return res.json({
  //     success: false,
  //     error: " INPUTS"
  //   });
  // }
  data.message = message;
  data.id = id;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});


router.get("/posts", (req, res) => {
  console.log("request reveiced to fetch alll posts");
  Post.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return  res.json(data) ;
  });
});


router.post("/posts", (req, res) => {
  let data = new Post();
  
  const { name,
    title,
    description,
    author,
    dateAdded,
    link } = req.body;
    console.log( req.body);
  data.name = name;
  data.title = title;
  data.description = description;
  data.author = author;
  data.dateAdded = dateAdded;
  data.link = link;
  console.log("saving data with name " + name);
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.delete("/deletePost", (req, res) => {
  const { id } = req.body;
  console.log("request reveiced to delete post" + id);
  Post.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(3007);
