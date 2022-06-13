const server = require("./server_config");
const initializeDatabase = require("./db/initialize");
const { createClient } = require("redis");
const { email_bull_queue } = require("./bull");
const { Server } = require("socket.io");
const { createServer } = require("http");
const { sendHTMLMail } = require("./functions/sendEmail");

email_bull_queue.process(function (job, done) {
  // send force=true with password recet email
  sendHTMLMail(
    job.data.recepient,
    job.data.subject,
    job.data.ejs_obj,
    job.data.force_send
  )
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

initializeDatabase();

// Redis
const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));
client
  .connect()
  .then(() => {})
  .catch((err) => console.log(err));

// setup socket.io for batch mailer
const httpServer = createServer(server);

const io = new Server(httpServer, {});

io.on("connection", (socket) => {
  console.log("socket id: ", socket.id);
  email_bull_queue.on("completed", (obj) => {
    io.emit("email-sent", obj.data.recepient);
  });
});

// Server starts
httpServer.listen(process.env.PORT);
module.exports = { io, httpServer };
