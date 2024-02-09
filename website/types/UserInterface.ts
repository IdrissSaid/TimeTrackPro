export interface IUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  role?: string[];
  code?: string;
  pointages?: [string];
  heures?: number,
  createdAt?: Date;
  updatedAt?: Date;
}
