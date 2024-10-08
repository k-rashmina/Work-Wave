const mongoose = require("mongoose");
const schema = mongoose.Schema;

const serviceProviderSchema = new schema({
  serviceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bidAmount: {
    type: Number,
    required: true,
  },
  bidDescription: {
    type: String,
    required: true,
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
    default: Date.now,
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
  bidClosingDate: {
    type: Date,
    required: function () {
      return this.jobType === "bid";
    },
  },
  bidStartingPrice: {
    type: Number,
    required: function () {
      return this.jobType === "bid";
    },
  },
  jobStatus: {
    type: String,
    enum: ["open", "closed"],
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
