const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/Listing.js");

const  Mongo_url= "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(Mongo_url);
}

const initDB = async () => {
  await Listing.deleteMany({});  //to delete previous data we have
  initData.data=initData.data.map((obj)=>({
    ...obj,
    owner:"68a221ac6544f7ca6c62854f",
  }))
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
