const mongoose = require("mongoose");
const schema = mongoose.Schema;
const { ConvertTimeToUTC } = require("../../util/timeUtil");

const serviceProviderSchema = new schema({
  serviceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bidAmount: {
    type: Number,
    default: null,
    required: false,
  },
  bidDescription: {
    type: String,
    default: null,
    required: false,
  },
  bidStatus: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: null,
    required: false,
  },
  jobStatus: {
    type: String,
    enum: ["pending", "ongoing", "completed"],
    default: null,
    required: false,
  },
});

const jobSchema = new schema({
  jobTitle: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  jobImages: {
    type: [String],
    required: false,
  },
  jobCategory: {
    type: String,
    required: true,
  },
  jobLocation: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
  },
  jobCreatedAt: {
    type: Date,
    default: function () {
      return ConvertTimeToUTC(new Date());
    },
  },
  jobDuration: {
    type: Number,
    required: true,
  },
  jobType: {
    type: String,
    enum: ["bid", "fixed"],
    required: true,
  },
  bidClosingAt: {
    type: Date,
    required: function () {
      return this.jobType === "bid";
    },
    default: function () {
      const bidClosingTime = new Date(this.jobCreatedAt);
      bidClosingTime.setHours(bidClosingTime.getHours() + 24);
      return bidClosingTime;
    },
  },
  bidStartingPrice: {
    type: Number,
    required: function () {
      return this.jobType === "bid";
    },
  },
  leastBidPrice: {
    type: Number,
    required: false,
  },
  jobStatus: {
    type: String,
    enum: ["open", "closed", "completed"],
    default: "open",
  },
  jobBudget: {
    type: Number,
    required: function () {
      return this.jobType === "fixed";
    },
  },
  negotiable: {
    type: Boolean,
    required: function () {
      return this.jobType === "fixed";
    },
  },
  jobOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobServiceProvider: {
    type: [serviceProviderSchema],
    required: function () {
      return this.jobType === "bid";
    },
  },
});

module.exports = mongoose.model("Job", jobSchema);
