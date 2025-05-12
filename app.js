const express = require("express");
const mongoose =  require("mongoose");
const cors = require('cors');
const app = express();
const  authentication = require("./middleware/authentication")
const dotenv = require('dotenv');
dotenv.config();

app.use(cors()); // Allow all origins by default
//to accept data as a json in req.body
app.use(express.json());

//import all the routes
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

//(parentpath , middleware, actual api)
app.use('/user', userRoutes);
app.use('/task',authentication.restrictToLoggedInUserOnly, taskRoutes);

//connect mongoDB
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Database Connected...");
});

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log("Server started...");
})