const server = require("./server_config");
const initializeDatabase = require("./db/initialize");

initializeDatabase();

// Server starts
server.listen(process.env.PORT);
