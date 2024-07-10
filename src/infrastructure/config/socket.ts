import { Socket, Server } from "socket.io";

const onlineusers = new Map<string, Socket>();
const rooms: Record<string, Set<string>> = {};

const configureSocket = (server: any) => {
  const io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
      origin: [process.env.FRONTEND_URL as string, "https://comingle.onrender.com"],
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

    /////////////// NOTIFICATION////////////////////////

    socket.on("notification", (authorId) => {
      socket.to(authorId).emit("notification");
    });

    /////////////////// vedio chat ///////////////////

    socket.on("user:joined", ({ userId }) => {
      socket.join(userId);
      console.log("user joined ", userId);
    });

    socket.on("calluser", ({ room, peerId, name, to }) => {
      console.log("send call to user", to);

      socket.to(to).emit("call", {
        message: `${name} is calling you`,
        to,
        room,
      });
      socket.to(room).emit("incommingCall", {
        from: peerId,
        room,
        message: `${name} is calling you`,
      });
    });

    socket.on("call:rejcted", ({ room }) => {
      socket.to(room).emit("call:rejcted", { message: "call rejected" });
    });

    // socket.on("another:call", ({ room }) => {
    //   socket.to(room).emit("another:call", { message: "on another call" });
    // });

    socket.on("call:ended", ({ room }) => {
      socket.to(room).emit("call:ended", { message: "call ended" });
    });
    socket.on("audio:status", ({ room }) => {
      socket.to(room).emit("audio:status");
    });
    socket.on("vedio:status", ({ room }) => {
      socket.to(room).emit("vedio:status");
    });

    ////////////// HANDLE NORMAL CHAT EVENTS//////////////////////////
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

    socket.on("message", ({ message, room, to }) => {
      const chat = message.chat;
      console.log("new message from user", message);

      socket.to(to).emit("new:chat", { room });

      // if (!chat.participants) return console.log("Chat participants not found");

      chat?.participants?.forEach((user: any) => {
        if (user._id === message.sender._id) {
          socket.emit("new message sent", { message, room });
        } else {
          socket.in(to).emit("message received", { message, room });
          socket.in(room).emit("message received", { message, room });
        }
      });
    });

    socket.on("typeing", (room) => {
      socket.to(room).emit("typeing");
    });
    socket.on("stopTypeing", (room) => {
      socket.to(room).emit("stopTypeing");
    });
    socket.on("exit:chat", ({ peerId, room }) => {
      if (rooms[room]) {
        const deletedUser = rooms[room].delete(peerId);

        if (deletedUser) {
          io.emit("user:left", {
            room,
            members: Array.from(rooms[room]),
          });
        }
      }
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
