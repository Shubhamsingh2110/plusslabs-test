import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from "./db/index.js";
import { app } from './app.js';
import Patient from './models/patient.models.js';
import authRoutes from './routes/auth.js';
import authMiddleware from './middleware/auth.js';

async function addTestPatient() {
    console.log("ℹ️ addTestPatient function started...");

    try {
        const newPatient = new Patient({
            userId: new mongoose.Types.ObjectId(),
            dob: new Date("1995-06-15"),
            gender: "Male",
            bloodType: "O+",
            weight: 75,
            medicalHistory: ["Diabetes", "Hypertension"],
            pastTests: [
                {
                    testId: new mongoose.Types.ObjectId(),
                    testDate: new Date(),
                    reportImages: ["https://example.com/report1.jpg"],
                }
            ]
        });

        console.log("ℹ️ Attempting to save patient...");
        await newPatient.save();
        console.log("✅ Patient added successfully!");
    } catch (err) {
        console.error("❌ Error inserting patient:", err.message);
    }
}

async function startServer() {
    try {
        await connectDB();
        console.log("✅ Database connected successfully!");

        // Use authentication routes
        app.use('/api/auth', authRoutes);

        // Example of a protected route
        app.get('/api/protected', authMiddleware, (req, res) => {
            res.send('This is a protected route');
        });

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            addTestPatient();
        });

    } catch (err) {
        console.error("❌ MongoDB connection failed:", err);
        process.exit(1); // Exit process if DB connection fails
    }
}

startServer();