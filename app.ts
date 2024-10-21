import express, {Application, Request, Response, ErrorRequestHandler  } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import seedAdmin from "./utils/seeder";
import cors from 'cors';
import fileUpload from "express-fileupload";
import apiRoutes from "./routes/api";
import { errorHandler } from "./utils/error";

dotenv.config();                
              
const app:Application = express();
const PORT = process.env.PORT || 3000;      


mongoose.connect(process.env.DATABASE_URL as string )
.then(()=>{
    console.log("MongoDB Connected Successfully.");
    return seedAdmin()})
.catch(()=>{
    console.log("Database connection faild");
})                            

app.use(cors());         
app.use(express.json());         
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {      
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    )
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    next()
});

app.use(fileUpload({
    limits: {fileSize: 50 * 1024 * 1024},
}));

app.use("/api/va", apiRoutes);

app.get('*', (req:Request, res:Response) => {
    res.send('Welcome to User application!');
})   

app.use(errorHandler as ErrorRequestHandler);
                
             
app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});  