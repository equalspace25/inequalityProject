import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI; 

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Could not connect to MongoDB');
  }
};
