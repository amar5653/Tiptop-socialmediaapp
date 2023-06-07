import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath} from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts} from "./data/index.js";
// Configuartions
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname,'pulic/assets')));

//File Storage
const storage = multer.diskStorage({
    destination: function( req,file, cb ){  
        cb(null, "public/assets"); /*everytime photo or video uploaded by user will be saved in public/assets */
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({storage}); // help us to save it .. everytime we upload a file we will use 'upload' variable

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

//mONGOOSE sETUP


const PORT = process.env.PORT || 4001;
const url = process.env.DATABASE_URL
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then (() => {
    app.listen(PORT, () => {console.log(` Connected on Server Port: ${PORT}`)});

    /* Add data one time */
  // User.insertMany(users);
  // Post.insertMany(posts);
})
.catch((err) => {console.log(`${err} not connected`)})
