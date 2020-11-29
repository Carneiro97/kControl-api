const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const usuariosRoute = require("./api/routes/usuarios");
const kitsRoute = require("./api/routes/kit");
const emprestimosRoute = require("./api/routes/emprestimo");

const https = require("http");

const port = process.env.PORT || 8080;

const server = https.createServer(app);

server.listen(port, () => console.log(`Listening on port ${port}`));

const socketIo = require("socket.io");

const io = socketIo(server, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "https://kitcontrol.herokuapp.com/",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

app.io = io;

io.on("connection", (socket) => {
  console.log("New client connected");
  app.socket = socket;
  io.emit("ClientConnection", "A client has just connected.");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    io.emit("ClientConnection", "A client has just disconnected.");
  });
});

/*mongoose.connect(
    'mongodb+srv://admin:' +
    process.env.MONGO_ATLAS_PW +
    '@kcontrol-9uglk.gcp.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    mongoose.Promise =  global.Promise;*/

mongoose.connect(
  "mongodb+srv://admin:admin@kcontrol-9uglk.gcp.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.Promise = global.Promise;

app.use(cors());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.headers(
      "Access-Control-Allow-Methods",
      "PUT, POST, PATCH, DELETE, GET"
    );
    return res.status(200).json({});
  }
  next();
});

app.use("/usuarios", usuariosRoute);
app.use("/kits", kitsRoute);
app.use("/emprestimos", emprestimosRoute);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = {
  io: io,
};
