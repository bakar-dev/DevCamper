const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const logger = require("./middleware/logger");
const connectDB = require("./config/db");

//import routes
const bootcamps = require("./routes/bootcamps");

//load env
dotenv.config({ path: "./config/config.env" });

connectDB();
const app = express();

//body parser
app.use(express.json());

const PORT = process.env.PORT || 5000;

//middleware
app.use(logger);

// Mount Routes
app.use("/api/v1/bootcamps", bootcamps);

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
