import mongoose from "mongoose";

const User = mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    role: [String],
    code: String,
  },
  {
    timestamps: true,
  }
)

export default mongoose.model.User || mongoose.model("User", User);
