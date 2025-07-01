import express from "express";

const app = express();

app.use("/auth", require("./auth/auth.routes"));

app.use("/quiz", require("./quize/index.routes"));

app.use("/questions", require("./questions/index.routes"));

app.use("/attempt", require("./attempt/index.routes"));

module.exports = app;
