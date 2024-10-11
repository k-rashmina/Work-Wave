const AssignedWorker = require("../../models/kalindu/jobs");
const User = require("../../models/chamath/userModel");
const moment = require("moment");

// Reschedule a worker's assignment
const rescheduleWorkerAssignment = async (req, res) => {
  const { workerId, assignmentId } = req.body; // Get workerId and assignmentId from request body

  try {
    // Fetch the user (service provider) and their available days
    const user = await User.findById(workerId);
    console.log("Fetched user:", user); // Log the fetched user

    if (!user || !user.availableDays || !user.availableDays.length) {
      return res.status(404).json({ message: "No available dates found for this worker." });
    }

    // Fetch the existing assignment
    const existingAssignment = await AssignedWorker.findById(assignmentId);
    if (!existingAssignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    // Find the soonest available date for the worker
    const newAssignedDate = await findNextAvailableDate(workerId, user.availableDays);

    if (!newAssignedDate) {
      return res.status(400).json({ message: "No upcoming available date found." });
    }

    // Update the assignment with the new date
    existingAssignment.assignedDate = newAssignedDate;
    await existingAssignment.save();

    res.json({
      message: "Worker assignment rescheduled successfully.",
      updatedAssignment: existingAssignment,
    });
  } catch (error) {
    console.error("Error details:", error); // Log the full error for debugging
    res.status(500).json({ message: "Error rescheduling worker assignment", error: error.message || error });
  }
};

// Function to find the next available date based on worker's available days
async function findNextAvailableDate(workerId, availableDays) {
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

  for (let i = 1; i <= 14; i++) { // Check for the next 14 days
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

module.exports = {  rescheduleWorkerAssignment };

