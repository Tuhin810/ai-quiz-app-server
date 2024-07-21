import express from "express";

const app = express();

app.use("/auth", require("./auth/auth.routes"));


module.exports = app;
