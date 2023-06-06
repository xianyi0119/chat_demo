const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.",users);

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users, userId, socket.id);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverIds, chatId, text }) => {
    
    receiverIds.forEach(receiverId => {
      const user = getUser(receiverId);
      console.log("receiverId,",senderId, receiverIds, chatId, text,user?.socketId)
      io.to(user?.socketId).emit("getMessage", {
        senderId,
        text,
        receiverId,
        chatId,
      });      
    });

  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!",users,socket.id);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});