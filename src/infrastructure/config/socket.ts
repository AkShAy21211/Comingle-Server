import { Socket, Server } from "socket.io";

const configureSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL as string, "http://192.168.1.4:5173"],
    },
  });

  io.on("connection", (socket: Socket) => {

   
    socket.on("setup",(user:any)=>{

        socket.join(user._id);
        console.log(user);
        
    })

    socket.on("disconnect", (socket) => {
      console.log("server disconnected",socket);
    });
  });
};

export default configureSocket;
