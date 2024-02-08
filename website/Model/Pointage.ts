import mongoose, { Document, Model, ObjectId } from "mongoose";

export interface IPointage extends Document {
  date: Date;
  user: ObjectId;
  pause: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const Pointage: Model<IPointage> | undefined = mongoose.models.Pointage
  ? mongoose.model<IPointage>("Pointage")
  : mongoose.model<IPointage>("Pointage", new mongoose.Schema(
      {
        date: {
          type: Date,
          required: [true, 'Need Date'],
        },
        user: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: [true, 'Need User'],
        },
        pause: {
          type: Boolean,
          required: [true, 'It\'s pause'],
        },
      },
      {
        timestamps: true,
      }
    ));

export default Pointage;
