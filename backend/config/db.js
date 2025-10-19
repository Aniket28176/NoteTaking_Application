import mongoose from "mongoose"

export const connectDB = async()=>{
    try {
       await mongoose.connect(process.env.mongo_url)
        console.log("MONGODB CONNECTED SUCCESSFULLY")
    } catch (error) {
        console.log("ERROR CONNECTION TO MONGODB",error);
        process.exit(1); 
    }
}