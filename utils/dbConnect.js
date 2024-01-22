import mongoose from "mongoose";

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) { // already connection exist
    return;
  }
  mongoose.connect(process.env.DB_URI);
};

export default dbConnect;