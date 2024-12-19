const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors") // Import CORS
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const taskRoutes = require("./routes/taskRoutes")

dotenv.config()
connectDB()

const app = express()

// Enable CORS for all origins
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
}))

app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
