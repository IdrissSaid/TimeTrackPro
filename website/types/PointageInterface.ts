export interface IPointage extends Document {
  date?: Date;
  user?: string;
  pause?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
