/* eslint-disable quotes */
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser, { json } from "body-parser";
import http from "http";
import connectDb from "./config/db.config";
import cron from "node-cron";

const mongo_url = process.env.NODE_ENV !== "PROD" ? process.env.LOCAL_MONGO_URL : process.env.PROD_MONGO_URL;

// dotenv.config();
const app = express();

const port = process.env.PORT || 8989;
app.use(express.json());

const options: cors.CorsOptions = {
	allowedHeaders: ["sessionId", "Content-Type"],
	exposedHeaders: ["sessionId"],
	origin: "*",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	preflightContinue: false
};

app.use(cors(options));
app.use(json());

app.use(express.json());
app.use(bodyParser.json());
app.get("/", (req, res) => {
	res.send(`<h1>govt server succesfully</h1>`);
});

app.use("/api/v1", require("./api/v1/routers/routes.index"));

connectDb();

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
