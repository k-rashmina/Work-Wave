const CustomerDetails = require("../../models/chamath/userModel");

const cusUpdate = async (req, res) => {
    const cusEmail = req.params.email; // Get email from request parameters

    try {
        const updatedCustomer = await CustomerDetails.updateOne(
            { email: cusEmail }, // Find customer by email
            {
                $set: {
                    email: req.body.email,
                    password: req.body.password,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    age: req.body.age,
                    gender: req.body.gender,
                    telephone: req.body.telephone,
                    address: req.body.address,
                    location: req.body.location,
                    profileImageURL: req.body.profileImageURL,
                },
            }
        );

        if (updatedCustomer.matchedCount === 0) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json({ message: "Customer Details Updated Successfully!", updatedCustomer });
    } catch (error) {
        res.status(400).json({ message: "Customer Details Update Failed", error });
    }
};

module.exports = cusUpdate;
