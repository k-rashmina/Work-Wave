const CustomerDetails = require("../../models/chamath/userModel");

const cusUpdateRating = async (req, res) => {
  const providerEmail = req.params.email; // Get the service provider's email
  const { rating, review, customerEmail } = req.body; // Get rating, review, and logged-in customer's email from request body

  // Log incoming data
  console.log("Provider Email:", providerEmail);
  console.log("Rating:", rating);
  console.log("Review:", review);
  console.log("Customer Email:", customerEmail);

  try {
    // Find the service provider by email
    const provider = await CustomerDetails.findOne({ email: providerEmail });

    if (!provider) {
      console.log("Service provider not found.");
      return res.status(404).json({ message: "Service provider not found" });
    }

    // Log found provider
    console.log("Found Service Provider:", provider);

    // Update service provider's rating
    const currentRating = provider.rating || 0;
    const currentRateCount = provider.rateCount || 0;
    const totalRating = currentRating * currentRateCount;
    const newTotalRating = totalRating + rating;
    const newRateCount = currentRateCount + 1;
    const newAverageRating = newTotalRating / newRateCount;

    // Update provider's rating and add the review
    await CustomerDetails.updateOne(
      { email: providerEmail },
      {
        $set: { rating: newAverageRating, rateCount: newRateCount },
        $push: { reviews: review }, // Add the review to the reviews array
      }
    );

    // Find the logged-in customer by their email
    const customer = await CustomerDetails.findOne({ email: customerEmail });
    if (!customer) {
      console.log("Logged-in customer not found.");
      return res.status(404).json({ message: "Logged-in customer not found" });
    }

    // Log found customer
    console.log("Found Logged-in Customer:", customer);

    // Increment customer points by 1
    const currentPoints = customer.points || 0;
    const updatedPoints = Math.min(currentPoints + 1, 20); // Ensure points don't exceed 20

    // Log updated points
    console.log("Updated Points:", updatedPoints);

    // Determine membership level and discount based on points
    let membership = "bronze";
    let membershipDiscount = 0.05;

    if (updatedPoints >= 6 && updatedPoints <= 10) {
      membership = "silver";
      membershipDiscount = 0.07;
    } else if (updatedPoints >= 11 && updatedPoints <= 15) {
      membership = "gold";
      membershipDiscount = 0.09;
    } else if (updatedPoints >= 16 && updatedPoints < 20) {
      membership = "platinum";
      membershipDiscount = 0.11;
    }else if (updatedPoints == 20) {
      membership = "platinum";
      membershipDiscount = 0.13;
    }

    // Log membership and discount
    console.log("Membership Level:", membership);
    console.log("Membership Discount:", membershipDiscount);

    // Update customer's points, membership, and membership discount
    await CustomerDetails.updateOne(
      { email: customerEmail },
      {
        $set: {
          points: updatedPoints,
          membership: membership,
          membershipDiscount: membershipDiscount,
        },
      }
    );

    res.json({ message: "Rating, review, and customer points updated successfully!" });
  } catch (error) {
    console.error("Server Error:", error); // Log the error details
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = cusUpdateRating;
