require("dotenv").config();
const mongoose = require("mongoose");
const xlsx = require("xlsx");
const FeatureData = require("./models/FeatureData");

const MONGO_URI = process.env.MONGO_URI;
const EXCEL_FILE_PATH = "./data.xlsx";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    loadData();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Convert Excel serial date to JavaScript Date
function excelSerialDateToJSDate(serialDate) {
  const EXCEL_EPOCH = new Date(Date.UTC(1899, 11, 30));
  return new Date(
    EXCEL_EPOCH.getTime() + (serialDate - 1) * 24 * 60 * 60 * 1000
  );
}

// Function to load data from Excel
async function loadData() {
  try {
    // Read the Excel file
    const workbook = xlsx.readFile(EXCEL_FILE_PATH, { cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rawData = xlsx.utils.sheet_to_json(sheet);

    // Transform the data to handle dates properly
    const transformedData = rawData.map((record) => {
      const dayValue = record.Day;
      let properDate;

      if (typeof dayValue === "number") {
        properDate = excelSerialDateToJSDate(dayValue);
      } else if (dayValue instanceof Date) {
        properDate = dayValue;
      } else if (typeof dayValue === "string") {
        properDate = new Date(dayValue);
      }

      return {
        ...record,
        Day: properDate,
        A: Number(record.A),
        B: Number(record.B),
        C: Number(record.C),
        D: Number(record.D),
        E: Number(record.E),
        F: Number(record.F),
      };
    });

    await FeatureData.deleteMany();

    await FeatureData.insertMany(transformedData);

    console.log("Data loaded successfully");

    const sampleDoc = await FeatureData.findOne();
    console.log("Sample document:", sampleDoc);
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    mongoose.connection.close();
  }
}
