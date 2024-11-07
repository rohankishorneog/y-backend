const express = require("express");
const FeatureData = require("../models/FeatureData");

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const data = await FeatureData.find();
    res.json(data);
  } catch (error) {
    console.error("Error retrieving all data:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/features", async (req, res) => {
  const { startDate, endDate, age, gender } = req.query;

  // Construct match conditions with only date filter initially
  const match = {
    Day: { $gte: new Date(startDate), $lte: new Date(endDate) },
  };

  // Add age filter only if a specific age is selected
  if (age && age !== "all") {
    match.Age = age;
  }

  // Add gender filter only if a specific gender is selected
  if (gender && gender !== "all") {
    match.Gender = gender;
  }

  try {
    const data = await FeatureData.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalA: { $sum: "$A" },
          totalB: { $sum: "$B" },
          totalC: { $sum: "$C" },
          totalD: { $sum: "$D" },
          totalE: { $sum: "$E" },
          totalF: { $sum: "$F" },
        },
      },
      {
        $project: {
          _id: 0,
          A: "$totalA",
          B: "$totalB",
          C: "$totalC",
          D: "$totalD",
          E: "$totalE",
          F: "$totalF",
        },
      },
    ]);

    console.log("Feature data query:", match); // Log the query for debugging
    console.log("Feature data result:", data);
    res.json(data[0] || {});
  } catch (error) {
    console.error("Error retrieving data:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/trend", async (req, res) => {
  const { feature, startDate, endDate, age, gender } = req.query;

  // Validate feature parameter
  const validFeatures = ["A", "B", "C", "D", "E", "F"];
  if (!validFeatures.includes(feature)) {
    return res.status(400).json({ error: "Invalid feature parameter" });
  }

  try {
    // Build base match conditions with date and feature
    const match = {
      Day: { $gte: new Date(startDate), $lte: new Date(endDate) },
      [feature]: { $exists: true },
    };

    // Add age filter only if a specific age is selected
    if (age && age !== "all") {
      match.Age = age;
    }

    // Add gender filter only if a specific gender is selected
    if (gender && gender !== "all") {
      match.Gender = gender;
    }

    const data = await FeatureData.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: "$Day",
          totalTime: { $sum: `$${feature}` },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: "$_id",
          totalTime: 1,
          count: 1,
          _id: 0,
        },
      },
    ]);

    console.log("Trend data query:", match); // Log the query for debugging
    console.log("Trend data result:", data);
    res.json(data);
  } catch (error) {
    console.error("Error retrieving trend data:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
