const express= require("express")
const app=express();
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const helmet=require("helmet")
const morgan=require("morgan")
dotenv.config();

const authRoute = require("./routes/auth");
const userRoute=require("./routes/users");
const postRoute=require("./routes/posts");






// mongodB Connection
async function connectToDatabase() {
    try {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Connection error', error);
    }
  }
  
  connectToDatabase();
  //MIDDLEWARE
  
  app.use(express.json());
  app.use(helmet());
  app.use(morgan("common"));



  app.use("/api/auth",authRoute);
  app.use("/api/users",userRoute);
  app.use("/api/posts",postRoute);

 

  app.listen(8800,()=>{
    console.log("backend is running")
})
