const AssignedWorker = require("../../models/asiri/assignedWorker");
const User = require("../../models/chamath/userModel");
const moment = require("moment");

// Assign a worker with the next available date
const assignWorkerWithNextAvailableDate = async (req, res) => {
  const { workerId } = req.params; // Get workerId from URL params

  try {
    // Fetch the user (service provider) and their available days
    const user = await User.findById(workerId);
    console.log("Fetched user:", user); // Log the fetched user

    if (!user || !user.availableDays || !user.availableDays.length) {
      return res.status(404).json({ message: "No available dates found for this worker." });
    }

    // Check available days
    console.log("Available days:", user.availableDays);

    // Calculate the next available date from the user's available days
    let nextAvailableDate = await calculateNextAvailableDate(workerId, user.availableDays);

    if (!nextAvailableDate) {
      return res.status(400).json({ message: "No upcoming available date found." });
    }

    // Create the new assignment with the workerId and the assigned date (in UTC)
    const newAssignment = new AssignedWorker({
      workerId, // Save the worker's ObjectId
      assignedDate: nextAvailableDate, // Save the next available date
    });

    console.log("New assignment:", newAssignment); // Log the new assignment

    await newAssignment.save();

    res.json({
      message: "Worker assigned successfully.",
      newAssignment,
    });
  } catch (error) {
    console.error("Error details:", error); // Log the full error for debugging
    res.status(500).json({ message: "Error assigning worker", error: error.message || error });
  }
};

// Function to calculate the next available date based on available days (using UTC)
async function calculateNextAvailableDate(workerId, availableDays) {
  const daysOfWeekMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const currentDate = moment().utc(); // Use UTC for current date
  let nextDate = null;

  // Get the next available date based on user's available days
  for (let i = 1; i <= 7; i++) { // Start from 1 to avoid today
    // Check each day of the week
    const dayIndex = (currentDate.day() + i) % 7; // Get the next day index
    const dayName = Object.keys(daysOfWeekMap).find(key => daysOfWeekMap[key] === dayIndex);
    
    if (availableDays.map(day => day.toLowerCase()).includes(dayName)) {
      // Calculate the corresponding date
      const calculatedDate = currentDate.clone().add(i, "days");

      // Check for existing assignments on the calculated date
      const existingAssignment = await AssignedWorker.findOne({
        workerId,
        assignedDate: { $eq: calculatedDate.startOf('day').toDate() },
      });

      if (!existingAssignment) {
        return calculatedDate.startOf('day').toDate(); // Return date in UTC, with time set to midnight
      }
    }
  }

  return null; // Return null if no available date found
}

module.exports = { assignWorkerWithNextAvailableDate };
