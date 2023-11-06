import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connect = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Cennected'))
    .catch(err => console.log(err));
};

mongoose.connection.on('error', err => {
  console.error('몽고디비 연결 에러', err);
});
