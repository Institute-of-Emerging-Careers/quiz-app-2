const server = require("./server_config");
const initializeDatabase = require("./db/initialize");
const { createClient } = require("redis");
const { email_bull_queue, queueMail } = require("./bull");
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

// Server starts
server.listen(process.env.PORT);
