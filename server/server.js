import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import venueRoutes from "./src/routes/venueRoutes.js";
import resourceRoutes from "./src/routes/resourceRoutes.js";
import sponsorRoutes from "./src/routes/sponsorRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ROUTES
app.use("/api/venues", venueRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/sponsors", sponsorRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});