require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const UserRoutes = require("./routers/userRoutes");
const TaskRoutes = require("./routers/taskRoutes");
const PostRoutes = require("./routers/postRoutes");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(UserRoutes.routes);
app.use("/api/task", TaskRoutes.routes);
app.use("/api/post", PostRoutes.routes);

app.use((err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }
  console.error("error handling middleware", err.stack);
  res.status(err.status || 500);
  res.json({ message: err.message || "Internal Server Error", status: false });
});

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("connect to mongodb server");
    app.listen(process.env.PORT, () => {
      console.log(`app listening at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("error in connection = ", err);
  });
