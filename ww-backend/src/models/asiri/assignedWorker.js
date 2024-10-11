const mongoose = require('mongoose');

// Define the schema for storing assigned worker details
const AssignedWorkerSchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedDate: {
    type: Date,
    required: true,
  }
}, { timestamps: true }); 

// Create and export the model
const AssignedWorker = mongoose.model('AssignedWorker', AssignedWorkerSchema);
module.exports = AssignedWorker;
