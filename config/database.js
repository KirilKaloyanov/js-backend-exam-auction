const mongoose = require("mongoose");

//TODO: change DB connection string
const CONNECTION_STRING = "mongodb://localhost:27017/auction";

module.exports = async (app) => {
  try {
    await mongoose.connect(CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("DB connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
