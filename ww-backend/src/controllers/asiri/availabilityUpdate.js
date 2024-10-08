// const User = require("../../models/chamath/userModel");

// // Controller function to update available days
// const updateAvailableDays = async (req, res) => {
//   const { userId } = req.params; // Get userId from URL params
//   const { availableDays } = req.body; // Get new available days from request body

//   try {
//     // Validate the input
//     if (!Array.isArray(availableDays) || availableDays.length === 0) {
//       return res.status(400).json({ message: "Available days must be a non-empty array." });
//     }

//     // Fetch the user by ID
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Update the available days
//     user.availableDays = availableDays; // Update only the availableDays field

//     await user.save(); // Save changes to the database

//     res.json({
//       message: "Available days updated successfully.",
//       updatedUser: {
//         id: user._id,
//         availableDays: user.availableDays,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating available days:", error);
//     res.status(500).json({ message: "Error updating available days", error: error.message || error });
//   }
// };

// module.exports = { updateAvailableDays };






const User = require("../../models/chamath/userModel");

// Controller function to update available days
const updateAvailableDays = async (req, res) => {
  const { userId } = req.params; // Get userId from URL params
  const { availableDays } = req.body; // Get new available days from request body

  try {
    // Validate the input
    if (!Array.isArray(availableDays) || availableDays.length === 0) {
      return res.status(400).json({ message: "Available days must be a non-empty array." });
    }

    // Update only the availableDays field while keeping other fields intact
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { availableDays } }, // Only update availableDays field
      { new: true, runValidators: true, fields: { availableDays: 1 } } // Specify only availableDays to update
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      message: "Available days updated successfully.",
      updatedUser: {
        id: updatedUser._id,
        availableDays: updatedUser.availableDays,
      },
    });
  } catch (error) {
    console.error("Error updating available days:", error);
    res.status(500).json({ message: "Error updating available days", error: error.message || error });
  }
};

module.exports = { updateAvailableDays };
