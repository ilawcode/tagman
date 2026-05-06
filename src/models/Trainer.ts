import { Model, Schema, model, models } from "mongoose";

type TrainerSkillDocument = {
  skill: Schema.Types.ObjectId;
  score: number;
};

export type TrainerDocument = {
  firstName: string;
  lastName: string;
  employmentType: "internal" | "external";
  consultingFirm?: string;
  biography: string;
  skills: TrainerSkillDocument[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const trainerSkillSchema = new Schema<TrainerSkillDocument>(
  {
    skill: {
      type: Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
  },
  { _id: false },
);

const trainerSchema = new Schema<TrainerDocument>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ["internal", "external"],
      required: true,
    },
    consultingFirm: {
      type: String,
      trim: true,
    },
    biography: {
      type: String,
      required: true,
      trim: true,
    },
    skills: {
      type: [trainerSkillSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Trainer: Model<TrainerDocument> =
  (models.Trainer as Model<TrainerDocument>) || model<TrainerDocument>("Trainer", trainerSchema);
