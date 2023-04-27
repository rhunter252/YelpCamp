const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
import * as dotenv from "dotenv";
dotenv.config();

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

async function seedImg(random10) {
  try {
    const res = await axios.get("https://api.pexels.com/v1/search", {
      headers: {
        Accept: "application/json",
        Authorization: PEXELS_API_KEY,
      },
      params: {
        query: "camping",
      },
    });
    // console.log(res.data.photos[random10].src.original);
    return res.data.photos[random10].src.original;
  } catch (err) {
    console.log(err);
  }
}

const sample = (array) => array[Math.round(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 700).toFixed(2);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "await seedImg()",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde commodi ut repellat illo? Praesentium velit cumque non repellat explicabo, animi dolorem possimus, expedita rerum quis aut optio dolore eum sequi!",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
