// controllers/getUserAvailability.js
const User = require("../../models/chamath/userModel"); // Adjust the path based on your project structure

const getUserAvailability = async (req, res) => {
  try {
    console.log("Email received:", req.params.email); 
    // Find user by ID
    const user = await User.findOne({ email: req.params.email }); 

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get available days from user
    const availableDays = user.availableDays;

    res.status(200).json(availableDays);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getUserAvailability };
