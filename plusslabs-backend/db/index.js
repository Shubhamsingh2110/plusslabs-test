// import mongoose from "mongoose";
// import { DB_NAME } from "../constants.js";

// const connectDB = async () => {
//     try {
//         if (!process.env.MONGO_URI) {
//             console.error("Missing MONGO_URI in environment variables");
//             process.exit(1);
//         }

//         const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         console.log(`\nMongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
//     } catch (error) {
//         console.error("MongoDB connection error:", error);
//         process.exit(1);
//     }
// };

// export default connectDB;


const mongoose = require("mongoose");

module.exports = () => {
	const connectionParams = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	try {
		mongoose.connect(process.env.MONGO_URI, connectionParams);
		console.log("Connected to database successfully");
	} catch (error) {
		console.log(error);
		console.log("Could not connect database!");
	}
};
