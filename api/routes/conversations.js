const router = require("express").Router();
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

//new conversation

router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: req.body.memberIds,
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conversation of a user

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    var queryKey = "receiverInfo." + req.params.userId
    const countList = await Message.aggregate([
      { $match: {[queryKey]:false} },
      { $group: {"_id": "$conversationId", "count":{"$sum":1}}}
    ]); 
    const countDict = {}
    countList.forEach( function  (value) {
      countDict[value["_id"]] = value["count"] ;
    });
    conversation.forEach( function  (value) {
      value["count"] = countDict[value["_id"]];
    });
    // console.log("conversation",conversation)
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
