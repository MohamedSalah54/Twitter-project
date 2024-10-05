import express from 'express';
import dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary'
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import connectMongoDB from './db/connectMongoDB.js';
import notificationRoutes from './routes/notification.route.js'
import cookieParser from 'cookie-parser';

dotenv.config()


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
const app = express()

const PORT = process.env.PORT || 5000;
app.use(express.json({limit:"5mb"}))
app.use(express.urlencoded({extended:true}))

app.use(cookieParser())
console.log(process.env.MONGO_URL);


app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/notifications",notificationRoutes);


app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    connectMongoDB();
});