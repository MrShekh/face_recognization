require("dotenv").config();
console.log("FACEPP_API_KEY:", process.env.FACEPP_API_KEY);
console.log("FACEPP_API_SECRET:", process.env.FACEPP_API_SECRET);
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

dotenv.config();
connectDB();

const app = express();
// ⬇️ Increase payload limit to 10MB (adjust as needed)
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/students", studentRoutes);



app.listen(5000, () => console.log("Server running on port 5000"));
