import express from "express"
import noteRoutes from "./routes/notesRoutes.js"
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors"



dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(express.json())
app.use("/api/notes",noteRoutes)

connectDB().then(()=>{
app.listen(PORT, () => {
  console.log("Server started at PORT:", PORT);
});
});