const express = require("express");
const http = require("http");
import socketIo from "socket.io";
import fs from "fs";
//Port from environment variable or default - 4001
const port = process.env.PORT || 4001;

//Setting up express and adding socketIo middleware
const app = express();
const server = http.createServer(app);
const socketConnection = socketIo(server);
server.listen(port, () => console.log(`Listening on port ${port}`));

let existingMocks = undefined as any;
try {
  // @ts-ignore
  existingMocks = JSON.parse(fs.readFileSync("./dev/mocks.json"));
} catch (err) {}

//Setting up a socket with the namespace "connection" for new sockets
socketConnection.on("connection", socket => {
  console.log("New client connected");
  socket.on("mocks", (mocks: any) => {
    fs.writeFileSync(
      "./dev/mocks.json",
      JSON.stringify({
        ...existingMocks,
        ...mocks
      })
    );
  });

  //A special namespace "disconnect" for when a client disconnects
  socket.on("disconnect", () => console.log("Client disconnected"));
});
