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

export type MocksType = {
  [key: string]: MockType[];
};

let mocks = {} as MocksType;

try {
  // @ts-ignore
  mocks = JSON.parse(fs.readFileSync("./dev/mocks.json"));
} catch (err) {
  mocks = {};
}

export type MockType = {
  id: string;
  data: {
    body: string;
    init: {
      status: number;
      statusText: string;
    };
    lastSeen: number;
    lastSeenHR: string;
  };
};

const resortMocksForId = (mock: MockType) => {
  mocks[mock.id] = mocks[mock.id].sort((a, b) => {
    return b.data.lastSeen - a.data.lastSeen;
  });
};

/**
 * Remove timestamp information and deal with the nasty jolokia error
 */
const mocksAreEqual = (a: MockType, b: MockType) => {
  return (
    a.data.body
      .replace(/"timestamp":[1234567890]+,/, "")
      .replace(/\[L[\w.;@]*/g, '""') ===
      b.data.body
        .replace(/"timestamp":[1234567890]+,/, "")
        .replace(/\[L[\w.;@]*/g, '""') &&
    a.data.init.status === b.data.init.status
  );
};

const handleIncomingMock = (mock: MockType) => {
  const mocksForId = mocks[mock.id];
  if (mocksForId === undefined) {
    mocks[mock.id] = [mock];
  } else {
    const existingMock = mocksForId.filter(existingMock => {
      return mocksAreEqual(existingMock, mock);
    })[0];
    if (existingMock) {
      // replace lastSeen and lastSeenHR so we can track stats and resort (makes culling easier)
      existingMock.data.lastSeen = mock.data.lastSeen;
      existingMock.data.lastSeenHR = mock.data.lastSeenHR;
      resortMocksForId(mock);
    } else {
      // add it to the list of possible responses (keep only five, cut oldest)
      mocksForId.unshift(mock);
      if (mocksForId.length > 5) {
        mocksForId.pop();
      }
    }
  }
};

//Setting up a socket with the namespace "connection" for new sockets
socketConnection.on("connection", socket => {
  console.log("New client connected");
  socket.on("mock", (mock: MockType) => {
    handleIncomingMock(mock);
    fs.writeFileSync(
      "./dev/mocks.json",
      JSON.stringify({
        ...mocks
      })
    );
  });

  //A special namespace "disconnect" for when a client disconnects
  socket.on("disconnect", () => console.log("Client disconnected"));
});
