import { Socket, Server } from "socket.io";

const onlineusers = new Map<string, Socket>();
const rooms: Record<string, Set<string>> = {};

const configureSocket = (server: any) => {
  const io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
      origin: [process.env.FRONTEND_URL as string, "http://192.168.1.4:5173"],
    },
  });

  io.on("connection", (socket: Socket) => {
    socket.on("login", ({ userId }) => {
      onlineusers.set(userId, socket);
      socket.join(userId);
      socket.broadcast.emit("onlineUsers", Array.from(onlineusers.keys()));
    });

    socket.on("request:onlineUsers", () => {
      socket.emit("onlineUsers", Array.from(onlineusers.keys()));
    });

    /////////////////// vedio chat ///////////////////

    socket.on("chat:start", ({ room, peerId }) => {
      socket.join(room);

      if (!rooms[room]) {
        rooms[room] = new Set();
        console.log(`Created new room: ${room}`);
      }
      rooms[room].add(peerId);

      io.to(room).emit("get:users", {
        room,
        members: Array.from(rooms[room]),
      });
      console.log("user jpined", rooms[room]);
    });

    socket.on("exit:chat", ({ peerId, room }) => {
      if (rooms[room]) {
        const deletedUser = rooms[room].delete(peerId);

        if (deletedUser) {
          console.log("user exit done", deletedUser);
          io.emit("user:left", {
            room,
            members: Array.from(rooms[room]),
          });
        }
      }
    });

    socket.on("calluser", ({ room, peerId, name }) => {
      socket.to(room).emit("incommingCall", { from: peerId, name, room });
    });

    socket.on("call:rejcted", ({ room }) => {
      socket.to(room).emit("call:rejcted", { message: "call rejected" });
    });

    socket.on("audio:status", ({ room }) => {
      socket.to(room).emit("audio:status");
    });
    socket.on("vedio:status", ({ room }) => {
      socket.to(room).emit("vedio:status");
    });
    ////////////// HANDLE NORMAL CHAT EVENTS//////////////////////////

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
    });
  });
};

export default configureSocket;
