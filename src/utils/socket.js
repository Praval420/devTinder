const socket = require('socket.io');
const Chat = require('../models/chat');

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, targetUserId, firstName, lastName }) => {
      const roomId = [userId, targetUserId].sort().join("-");
      socket.join(roomId);
      console.log(`${firstName} joined room: ${roomId}`);
    });

    socket.on("sendMessage", async ({ userId, targetUserId, text, firstName, lastName }) => {
      try {
        let user = await Chat.findOne({
  participants: { $all: [userId, targetUserId] }
});
console.log(user);
if (!user) {
  user =new Chat({
    participants: [userId, targetUserId],
    messages: [{ senderId: userId, text }]  
  });
}

if (!user.messages) {
  user.messages = [];  
}

user.messages.push({
  senderId: userId,
  text,
});

await user.save();

        io.to([userId, targetUserId].sort().join("-")).emit("messageReceived", {
          text,
          firstName,
          lastName,
          senderId: userId,
        });
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });
  });
};

module.exports = initializeSocket;