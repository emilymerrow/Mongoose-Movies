const mongoose = require("mongoose");
 
// Don't add the Relationship on the User Schema
const userSchema = new mongoose.Schema(
  {
    name: String,
    googleId: {
      type: String,
      required: true,
    },
    email: String,
    avatar: String
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
