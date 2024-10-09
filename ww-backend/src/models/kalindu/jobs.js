const mongoose = require("mongoose");

const jobsSchema = new mongoose.Schema(
  {
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
      enum: ["plumbing", "electrical", "cleaning", "other"],
    },
    jobType: {
      type: String,
      enum: ["bid", "fixed"],
      required: true,
    },
    bidAmount: {
      type: Number,
      default: null,
    },
    bidClosingDate: {
      type: Date,
      required: function () {
        return this.jobType === "bid";
      },
    },
    jobBudget: {
      type: Number,
      required: true,
    },
    jobStatus: {
      type: String,
      enum: ["pending", "onGoing", "completed"],
      default: "pending",
    },
    jobOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    workerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "users",
      default: null,
    },
    bidders: [
      {
        bidderId: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "users",
          required: true,
        },
        bidAmount: {
          type: Number,
        },
        bidDescription: {
          type: String,
          default: null,
        },
        bidStatus: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
        },
      },
    ],
    assignedDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const jobs = mongoose.model("jobs", jobsSchema);
module.exports = jobs;
