const CustomerDetails = require("../../models/chamath/userModel");

const cusget = async (req, res) => {
    try {
        const readCustomer = await CustomerDetails.findOne({ email: req.params.email });
        if (!readCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json(readCustomer);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = cusget;
