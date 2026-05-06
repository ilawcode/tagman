import { Model, Schema, model, models } from "mongoose";

export type UserDocument = {
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const User: Model<UserDocument> =
  (models.User as Model<UserDocument>) || model<UserDocument>("User", userSchema);
