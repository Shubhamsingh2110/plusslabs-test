import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express(); // Initialize app before using it

app.use(cors());
app.use(express.json()); // Ensure JSON body parsing for API requests
app.use("/api/auth", authRoutes); // Now correctly placed

export { app };
