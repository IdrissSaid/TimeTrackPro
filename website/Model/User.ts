import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  role: string[];
  code: string;
  pointages: [type: mongoose.Types.ObjectId];
  createdAt: Date;
  updatedAt: Date;
}

const User: Model<IUser> | undefined = mongoose.models.User
  ? mongoose.model<IUser>("User")
  : mongoose.model<IUser>("User", new mongoose.Schema(
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
        pointages: {
          type: [{
            type: mongoose.Types.ObjectId,
            ref: "Pointage",
          }],
          default: [],
        },
        code: {
          type: String,
          unique: true,
          required: [true, 'Need Code'],
        },
      },
      {
        timestamps: true,
      }
    ));

export default User;
