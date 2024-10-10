// const User = require("../../models/chamath/userModel"); // Adjust path to your User model
// const AssignedWorker = require("../../models/kalindu/jobs"); // Adjust path to your AssignedWorker model

// const getAssignedDates = async (req, res) => {
//   try {
//     console.log("Email received:", req.params.email);

//     // Find user by email
//     const user = await User.findOne({ email: req.params.email });

//     // Check if user exists
//     if (!user) {
//       return res.status(404).json({ message: "Worker not found" });
//     }

//     // Find assigned dates using the worker's ObjectId (worker._id)
//     const assignedDates = await AssignedWorker.find({ workerId: user._id });

//     // Check if there are any assigned dates
//     if (!assignedDates || assignedDates.length === 0) {
//       return res.status(404).json({ message: "No assigned dates found" });
//     }

//     // Respond with the assigned dates
//     res.status(200).json(assignedDates);
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: err.message });
//   }
// };

// module.exports = { getAssignedDates };





const User = require("../../models/chamath/userModel"); // Adjust path to your User model
const AssignedWorker = require("../../models/kalindu/jobs"); // Adjust path to your AssignedWorker model

const getAssignedDates = async (req, res) => {
  try {
    console.log("Email received:", req.params.email);

    // Find user by email
    const user = await User.findOne({ email: req.params.email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Find assigned dates using the worker's ObjectId (worker._id) and populate user details
    const assignedDates = await AssignedWorker.find({ workerId: user._id })
      .populate({
        path: "jobOwner",  // Assuming "jobOwner" is the user reference in AssignedWorker model
        model: "User", 
        select: "firstName lastName telephone category address", // Only select these fields from the user model
      });

    // Check if there are any assigned dates
    if (!assignedDates || assignedDates.length === 0) {
      return res.status(404).json({ message: "No assigned dates found" });
    }

    // Respond with the assigned dates and populated user data
    res.status(200).json(assignedDates);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getAssignedDates };
