const { Server } = require("socket.io");
const { db } = require("./config/firebase");
const { CLIENT_URL } = require("./config/constant");

const { FieldValue } = require("firebase-admin/firestore");

const initSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // Xử lý sự kiện gửi tin nhắn
    socket.on("send_message", async (message) => {
      // Logic lưu vào DB
      const chatRoomRef = db.collection("chatRooms").doc(message.phoneNumber);
      const doc = await chatRoomRef.get();

      if (doc.exists) {
        await chatRoomRef.update({
          messages: FieldValue.arrayUnion(message),
        });
      } else {
        await chatRoomRef.set({
          messages: [message],
        });
      }
      // Phát lại tin nhắn
      io.to(message.phoneNumber).emit("receive_message", message);
    });

    // Xử lý sự kiện tham gia phòng
    socket.on("join_room", async (roomId) => {
      socket.join(roomId);
      const chatRoomRef = db.collection("chatRooms").doc(roomId);
      const doc = await chatRoomRef.get();
      if (doc.exists) {
        const messages = doc.data();
        socket.emit("load_messages", messages.messages);
      }
    });
    // Xử lý sự kiện leave_room
    socket.on("leave_room", (roomId) => {
      socket.leave(roomId);
    });

    // Lắng nghe sự kiện ngắt kết nối
    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });

  return io;
};

module.exports = initSocketIO;
