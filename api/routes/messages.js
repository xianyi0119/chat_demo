const router = require("express").Router();
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

//add

router.post("/", async (req, res) => {
  try {
    const sender = await User.findById(req.body.sender);
    req.body["senderName"] = sender["username"];
    const conversation = await Conversation.findById(req.body.conversationId);
    req.body["receiverInfo"] = {}
    conversation["members"].forEach( function  (value) {
      if (req.body.sender !== value)
      {req.body["receiverInfo"][value] = false}
      else {};
    });
  } catch (err) {
      console.log(err);
  }
  const newMessage = new Message(req.body);
  
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});


//get

router.get("/:conversationId/:userId", async (req, res) => {
  try {
    // todo paging
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    const queryKey = "receiverInfo." + req.params.userId
    const updateResult = await Message.updateMany({
      conversationId: req.params.conversationId,
      [queryKey]:false,
    },{"$set":{[queryKey]:true}});
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
