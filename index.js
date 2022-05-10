const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")

// to use dot env
dotenv.config();

// Connect to MongoDB database
mongoose.connect(process.env.MONGO_URL, () => {
    console.log("Connected to MongoDB!")
})

// middleware- it a body parser, when we make a post request, it parses it
app.use(express.json());

app.use(helmet());
app.use(morgan("common"))

// Routes
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)

// Port
app.listen(8800, () => {
    console.log("Backend Server is running!");
})