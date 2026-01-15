import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// CORS
if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:5173" }));
} else {
  app.use(cors({ origin: process.env.FRONTEND_URL }));
}

app.use(express.json());

// Routes
app.use("/api/notes", notesRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
