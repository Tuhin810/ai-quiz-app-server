import mongoose from "mongoose";
import { NODE_ENV } from "./config";

console.log("NODE_ENV", String(NODE_ENV));

const mongoURI: string =
	String(NODE_ENV) == "PROD"
		? "mongodb+srv://tuhinthakur1233:DY2p354LuqgXPef0@cluster0.r5uuwtr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/Local_DB"
		: String(NODE_ENV) == "DEV"
		? "mmongodb+srv://tuhinthakur1233:AeXuM5uinxQZ6YhL@cluster0.wrvuqlr.mongodb.net/Dev"
		: String(NODE_ENV) == "LOCAL"
		? "mongodb+srv://tuhinthakur1233:DY2p354LuqgXPef0@cluster0.r5uuwtr.mongodb.net/brain_brew"
		: "";

console.log("First Connection", mongoURI);

const connectDb = async () => {
	try {
		if (mongoURI) {
			const conn = await mongoose.connect(mongoURI, {
				serverSelectionTimeoutMS: 40000
			});
			console.log("Second Connection -->", mongoURI);
			console.log(`\x1b[34m \x1b[1m \x1b[4mMongoDB Connected: ${conn.connection.port}\x1b[0m`);
		}
	} catch (err) {
		throw err;
	}
};
export default connectDb;
