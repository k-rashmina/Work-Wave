const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dbConnect = require("./db-config");
const routes = require("./routes");
const updateJobStatus = require("./scheduler/schedular");

//initialization and middleware
const app = express();
dotenv.config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json({ limit: "15mb" }));
//routes
app.use("/", routes);

//db connection

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
  dbConnect();
  updateJobStatus();
});
