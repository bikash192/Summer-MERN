require('dotenv').config(); // Load environment variables from .env file
const express=require('express');// Importing the express module
const app=express(); // Creating an instance of express
const authRoutes=require('./src/routes/authRoutes');
const cors=require('cors');
const cookieParser = require('cookie-parser'); // Importing cookie-parser for handling cookies
const mongoose = require('mongoose');

// Importing mongoose for MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});


app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser());
app.use('/auth',authRoutes);
const corsOptions={
    origin:process.env.CLIENT_ENDPOINT , // Allow requests from the client URL specified in .env
    credentials:true
}
app.use(cors(corsOptions));

const PORT=5000;
app.get('/',(req,res)=>{
    res.send('Hello Word')
})

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})