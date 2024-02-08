export interface IUser extends Document {
  id: string;
  firstName: string;
  lastName: string;
  role: string[];
  code: string;
  pointages: [string];
  createdAt: Date;
  updatedAt: Date;
}
