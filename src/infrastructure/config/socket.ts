import { Socket, Server } from "socket.io";




const onlineusers= new Set();


const configureSocket = (server: any) => {
  const io = new Server(server, {
    connectionStateRecovery:{},
    cors: {
      origin: [process.env.FRONTEND_URL as string, "http://192.168.1.4:5173"],
    },
  });

  io.on("connection", (socket: Socket) => {
    
  


    socket.on("Chat", (selectedChat) => {
      const room = selectedChat;
      socket.join(room);
    });

    socket.on("message", (newMessage) => {


      const chat  = newMessage.chat;

      if(!chat.participants) return console.log('Chat participants not found');
      
      chat.participants.forEach((user:any) => {
        
        if(user._id === newMessage.sender._id) return;

        io.to(chat._id).emit("message received",newMessage);
        io.emit("message received",newMessage)
      });

    });
    socket.on("disconnect", (socket) => {
      console.log("server disconnected", socket);
    });
  });
};

export default configureSocket;
