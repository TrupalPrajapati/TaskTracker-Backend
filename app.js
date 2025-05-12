const express = require("express");
const mongoose =  require("mongoose");
const cors = require('cors');
const app = express();
const  authentication = require("./middleware/authentication")
const dotenv = require('dotenv');
dotenv.config();

// app.use(cors()); // Allow all origins by default

app.use(cors({
  origin: [
    "https://task-tracker-frontend-three.vercel.app",
    "http://localhost:5173"
  ]
}));


//to accept data as a json in req.body
app.use(express.json());

//import all the routes
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

//(parentpath , middleware, actual api)
app.use('/user', userRoutes);
app.use('/task',authentication.restrictToLoggedInUserOnly, taskRoutes);

//root route for check deployment 
app.get('/',(req,res)=>{
    res.send('API is running');
})

//connect mongoDB
// mongoose.connect(process.env.MONGO_URL).then(()=>{
//     console.log("Database Connected...");
// });
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true, // Force TLS
  tlsAllowInvalidCertificates: false, // Reject invalid certs  
}).then(()=>{
    console.log("MongoDB connected...");
}).catch((err)=>{
    console.log("MongoDB connection Error:", err);
})

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log("Server started...",PORT);
})

