require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Bağlandı"))
  .catch(err => console.log(err));

// Yönlendirmeleri proje içine dahil et
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/authRoutes");
const cityRoutes = require("./routes/cityRoutes");
const countryRoutes = require("./routes/countryRoutes");
const placeRoutes = require("./routes/placeRoutes");
const commentRoutes = require("./routes/commentRoutes");

app.use("/api", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/comments", commentRoutes);

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});