const CustomerDetails = require("../../models/chamath/userModel");


const cusCreate = async (req, res) => {
  const user = req.body;
  const newCustomer = new CustomerDetails(user);

  try {
    const savedCustomerDetails = await newCustomer.save();
    res.status(200);
    res.json({
      message: "Customer Registered Successfully!",
      savedCustomerDetails,
    });

  } catch (error) {
    res.status(400);
    res.json({ message: "Customer Registration Failed", error });
  }
};
module.exports = cusCreate;
