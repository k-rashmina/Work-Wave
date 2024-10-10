const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  telephone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      default: "Point", // GeoJSON type
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: "2dsphere", // This will allow for geospatial queries
    },
  },
  category: {
    type: String,
    default: null,
    required: false,
  },
  availableDays: {
    type: [String],
    default: null,
    required: false,
  },
  experience: {
    type: String,
    default: null,
    required: false,
  },
  certImageURL: {
    type: String,
    default: null,
    required: false,
  },
  profileImageURL: {
    type: String,
    default: null,
    required: false,
  },
  points: {
    type: Number,
    default: 0,
    required: false,
  },
  membership: {
    type: String,
    enum: ["Bronze", "Silver", "Gold", "Platinum"],
    default: null,
    required: false,
  },
  membershipDiscount: {
    type: Number,
    default: 0,
    required: false,
  },
  rating: {
    type: Number,
    default: 0,
    required: false,
  },
  rateCount: {
    type: Number,
    default: 0,
    required: false,
  },
  reviews: {
    type: [String],
    default: [],
    required: false,
  },
});

// Create a geospatial index for the location field
userSchema.index({ location: "2dsphere" });

// Create the user model
module.exports = mongoose.model("User", userSchema);
