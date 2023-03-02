import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv-safe'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/user.js"
import listRoutes from "./routes/list.js"
import entryRoutes from "./routes/entry.js"


/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url)           
//const __dirname = path.dirname(__filename)
dotenv.config();

const app = express()
app.use(express.json())
//security
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
//Logger
app.use(morgan("common"))   
app.use(bodyParser.json({ limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
app.use(cors());
//app.use("/assets", express.static(path.join(__dirname, 'public/assets')))


/* ROUTES */
app.use("/auth", authRoutes)
app.use("/user",userRoutes)
app.use("/booklist", listRoutes)
app.use("/entry", entryRoutes)

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    app.listen(PORT, () => console.log(`Server Listening on Port: ${PORT}`));
})
.catch((error)=> console.log(`${error} did not connect`));