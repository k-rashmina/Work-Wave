
const User = require("../../models/chamath/userModel");

const updateAvailableDays = async (req, res) => {
  const { availableDays } = req.body; // Get new available days from request body
  const email = req.params.email; // Get email from URL params

  try {
    // Validate the input
    if (!Array.isArray(availableDays) || availableDays.length === 0) {
      return res.status(400).json({ message: "Available days must be a non-empty array." });
    }

    // Update only the availableDays field while keeping other fields intact
    const updatedUser = await User.findOneAndUpdate(
      { email: email }, // Use an object to find the user by email
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
