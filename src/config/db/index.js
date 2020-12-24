const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("Db connect");
  } catch (error) {
    console.log("Error:connectDb =>", error);
    process.exit(1);
  }
};

module.exports = connectDb;
