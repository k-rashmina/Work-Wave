const mongoose = require("mongoose");
const { ConvertTimeToUTC } = require("../../util/timeUtil");

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
    jobCreatedAt: {
      type: Date,
      default: function () {
        return ConvertTimeToUTC(new Date());
      },
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
    jobBudget: {
      type: Number,
      required: true,
    },
    jobStatus: {
      type: String,
      enum: ["pending", "onGoing", "completed", "rejected "],
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
          default: null,
        },
        bidDescription: {
          type: String,
          default: null,
        },
        bidStatus: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: null,
        },
      },
    ],
    assignedDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      currentTime: () => {
        const newDate = new Date();
        const localDate = new Date(
          newDate.getTime() - newDate.getTimezoneOffset() * 60000
        );
        return localDate;
      },
    },
  }
);

const jobs = mongoose.model("jobs", jobsSchema);
module.exports = jobs;
