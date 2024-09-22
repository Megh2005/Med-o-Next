import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export const connectDB = async (): Promise<void> => {
  if (connection.isConnected) {
    return;
  }

  try {
    const connectionInstance = await mongoose.connect(
      (process.env.NEXT_PUBLIC_MONGODB_URI as string) + "/echo-prod" || ""
    );
    connection.isConnected = connectionInstance.connections[0].readyState;
    console.log("Connected to Database");
  } catch (error) {
    console.error("Error connecting to database: ", error);
    process.exit(1);
  }
};
