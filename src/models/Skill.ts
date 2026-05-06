import { Model, Schema, model, models } from "mongoose";

export type SkillDocument = {
  name: string;
  nameLower: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const skillSchema = new Schema<SkillDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nameLower: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

skillSchema.index(
  { nameLower: 1 },
  { unique: true, partialFilterExpression: { isActive: true } },
);

export const Skill: Model<SkillDocument> =
  (models.Skill as Model<SkillDocument>) || model<SkillDocument>("Skill", skillSchema);
