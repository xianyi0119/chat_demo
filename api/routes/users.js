const User = require("../models/User");
const Message = require("../models/Message");
const router = require("express").Router();
const bcrypt = require("bcrypt");


//get users
router.post("/users", async (req, res) => {
  try {
    const users = await User.find({ username: {"$regex":req.body.userName }});
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json(err);
  }
});

//get users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a user's unread count
router.get("/unread", async (req, res) => {
  const userId = req.query.userId;
  try {
    var key = "receiverInfo." + userId
    const count = await Message.count({[key]:false});
    res.status(200).json({"count":count});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
