import { Socket, Server } from "socket.io";
import { log } from "console";

const onlineusers = new Map<string, Socket>();
const rooms = new Map();
const socketToIdMap = new Map();

const configureSocket = (server: any) => {
  const io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
      origin: [process.env.FRONTEND_URL as string, "http://192.168.1.4:5173"],
    },
  });

  io.on("connection", (socket: Socket) => {
    socket.on("login", ({ userId }) => {
      console.log("user connected", userId);

      onlineusers.set(userId, socket);
      socket.join(userId);
      socket.broadcast.emit("onlineUsers", Array.from(onlineusers.keys()));
    });

    socket.on("request:onlineUsers", () => {
      socket.emit("onlineUsers", Array.from(onlineusers.keys()));
    });

    console.log("onine users", onlineusers.keys());

    socket.on("initialize:video-chat", ({ roomId, userId }) => {
      console.log("user inted ved", roomId, userId);

      rooms.set(userId, socket.id);
      socketToIdMap.set(socket.id, userId);
      io.to(roomId).emit("user:joined", { userId, id: socket.id });
      socket.join(roomId);
      io.to(socket.id).emit("join:room", { roomId, userId });
    });

    socket.on("user:call", ({ to, offer }) => {
      io.to(to).emit("incomming:call", { from: socket.id, offer });
    });

    socket.on("call:accepted", ({ to, ans }) => {
      io.to(to).emit("call:accepted", { from: socket.id, ans });
    });

    socket.on("peer:nego:needed", ({ to, offer }) => {
      io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });

    socket.on("peer:nego:done", ({ to, ans }) => {
      io.to(to).emit("peer:nego:final", { from: to, ans });
    });

    socket.on("chat initilize", (room) => {
      console.log("new   user", room);

      socket.join(room);
    });

    socket.on("message", ({ message, room }) => {
      const chat = message.chat;
      console.log("new message from user", message);

      if (!chat.participants) return console.log("Chat participants not found");

      chat.participants.forEach((user: any) => {
        if (user._id === message.sender._id)
          socket.emit("new message sent", { message, room });

        socket.in(room).emit("message received", { message, room });
      });
    });

    socket.on("typeing", (room) => {
      socket.to(room).emit("typeing");
    });
    socket.on("stopTypeing", (room) => {
      socket.to(room).emit("stopTypeing");
    });

    /////////////////Admin socket events/////////////////

    socket.on("admin_block_user", (userId) => {
      console.log("Admin blocking user", userId);

      io.to(userId).emit("user_blocked", {
        userId: userId,
        reason: "You have been blocked by the admin.",
      });
    });

    socket.on("disconnect", () => {
      let disconnectedUserId: string | undefined;
      onlineusers.forEach((sock, userId) => {
        if (sock.id === socket.id) {
          disconnectedUserId = userId;
          onlineusers.delete(userId);
          socket.broadcast.emit("onlineUsers", Array.from(onlineusers.keys()));
          return;
        }
      });

      // /////////////////Admin socket events/////////////////

      // socket.on("admin_block_user", (userId) => {
      //   io.to(userId).emit("user_blocked", {
      //     reason: "You have been blocked by the admin.",
      //   });
      // });

      if (!disconnectedUserId) {
        console.log(`Could not find userId for socket: ${socket.id}`);
      }
    });
  });
};

export default configureSocket;
