const server = require("./server_config");
const initializeDatabase = require("./db/initialize");
const { createClient } = require("redis");
const { email_bull_queue, queueMail } = require("./bull");
const { sendHTMLMail } = require("./functions/sendEmail");

initializeDatabase();

// Redis
const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));
client
  .connect()
  .then(() => {})
  .catch((err) => console.log(err));

// Server starts
server.listen(process.env.PORT);
