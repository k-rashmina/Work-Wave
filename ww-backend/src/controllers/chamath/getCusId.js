const mongoose = require("mongoose");
const CustomerDetails = require("../../models/chamath/userModel");

const getCusId = async (req, res) => {
  try {
    const readCustomerId = await CustomerDetails.findOne({
      email: req.params.email,
    });
    if (!readCustomerId) {
      return res.status(404).json({ message: "Customer not found" });
    }
    // console.log("req.params.email", readCustomerId._id.toString());
    res.status(200).json({
      id: readCustomerId._id,
      location: readCustomerId.location.coordinates,
      address: readCustomerId.address,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = getCusId;
