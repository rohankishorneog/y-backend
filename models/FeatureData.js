// server/models/FeatureData.js
const mongoose = require("mongoose");

const featureDataSchema = new mongoose.Schema({
  Day: {
    type: Date,
    required: true,
  },
  Age: {
    type: String,
    required: true,
  },
  Gender: {
    type: String,
    required: true,
  },
  A: Number,
  B: Number,
  C: Number,
  D: Number,
  E: Number,
  F: Number,
});

// Define the model
const FeatureData = mongoose.model("FeatureData", featureDataSchema);

// Export the model
module.exports = FeatureData;
