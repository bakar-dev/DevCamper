const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");

//import routes
const bootcamps = require("./routes/bootcamps");

//load env
dotenv.config({ path: "./config/config.env" });

const app = express();

const PORT = process.env.PORT || 5000;

//middleware
app.use(logger);

// Mount Routes
app.use("/api/v1/bootcamps", bootcamps);

app.listen(PORT, () =>
  console.log(`server runing on ${process.env.NODE_ENV} mode on port: ${PORT}`)
);
