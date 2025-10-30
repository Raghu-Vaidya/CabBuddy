import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser"
import { createServer } from "http"
import { Server } from "socket.io"

import authRoute from "./routes/auth.routes.js"
import userRoute from "./routes/user.routes.js"
import rideRoute from "./routes/ride.routes.js"

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: [process.env.ORIGIN, "http://localhost:5173"],
    credentials: true,
  }
})
const PORT = 8080; // Using a fixed port 8080 to avoid conflicts

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    console.log("Continuing without database connection. Some features may not work.");
    // Don't exit the process, allow the server to start anyway
  }
};

//middlewares
app.use(cors({
    origin: [process.env.ORIGIN, "http://localhost:5173"],
    credentials: true,
  }
))
app.use(cookieParser())
app.use(express.json())

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/rides", rideRoute);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-ride', (rideId) => {
    socket.join(`ride-${rideId}`);
    console.log(`User ${socket.id} joined ride ${rideId}`);
  });

  socket.on('leave-ride', (rideId) => {
    socket.leave(`ride-${rideId}`);
    console.log(`User ${socket.id} left ride ${rideId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: err.status,
    error: errorMessage
  })
})

// Try to connect to database, but start server regardless
connectDB().catch(err => {
  console.error("Failed to connect to database:", err)
  console.log("Starting server without database connection. Some features may not work.")
});

// Start the server regardless of database connection
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`)
})
