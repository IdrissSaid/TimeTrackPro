import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  role: string[];
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Need First Name'],
    },
    lastName: {
      type: String,
      required: [true, 'Need Last Name'],
    },
    role: {
      type: [String],
      required: [true, 'Need at least one Role'],
      validate: {
        validator: (roles: string[]) => roles.length > 0,
        message: 'At least one role is required',
      },
    },
    code: {
      type: String,
      required: [true, 'Need Code'],
    },
  },
  {
    timestamps: true,
  }
);

const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
