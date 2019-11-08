const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

//import routes
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");

//load env
dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

//body parser
app.use(express.json());

const PORT = process.env.PORT || 5000;

//middleware
app.use(logger);
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount Routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

//error middleware
app.use(errorHandler);

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
