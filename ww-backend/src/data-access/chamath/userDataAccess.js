const userModel = require("../../models/chamath/userModel");

class UserDataAccess {
  async createUser(user) {
    try {
      const newUser = await userModel.create(user);
      return newUser;
    } catch (error) {
      throw new Error(
        console.log("Error creating user: ", error.message),
        `Error occurred while creating new user: ${error.message}`
      );
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await userModel.findOne({ email });
      return user;
    } catch (error) {
      throw new Error(
        console.log("Error getting user by email: ", error.message),
        `Error occurred while getting user by email: ${error.message}`
      );
    }
  }
}

module.exports = new UserDataAccess();
