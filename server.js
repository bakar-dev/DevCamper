const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const connectDB = require("./config/db");

//import routes
const bootcamps = require("./routes/bootcamps");

//load env
dotenv.config({ path: "./config/config.env" });

connectDB();
const app = express();

const PORT = process.env.PORT || 5000;

//middleware
app.use(logger);

// Mount Routes
app.use("/api/v1/bootcamps", bootcamps);

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
