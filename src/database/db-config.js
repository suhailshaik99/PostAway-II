import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(`Application connected to the Database Successfully!!`);
  } catch (error) {
    throw new Error(error.message);
  }
};
