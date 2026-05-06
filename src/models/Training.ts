import { Model, Schema, model, models } from "mongoose";

export type TrainingStatus = "planned" | "cancelled" | "completed";

export type TrainingDocument = {
  subject: string;
  date: Date;
  durationMinutes: number;
  location: string;
  coordinator?: Schema.Types.ObjectId | string;
  notes?: string;
  cancelNote?: string;
  completionScore?: number;
  primaryTrainer?: Schema.Types.ObjectId;
  coTrainers: Schema.Types.ObjectId[];
  status: TrainingStatus;
  createdAt: Date;
  updatedAt: Date;
};

const trainingSchema = new Schema<TrainingDocument>(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    date: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 15,
      max: 24 * 60,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    coordinator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    cancelNote: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    completionScore: {
      type: Number,
      min: 1,
      max: 10,
    },
    primaryTrainer: {
      type: Schema.Types.ObjectId,
      ref: "Trainer",
    },
    coTrainers: {
      type: [Schema.Types.ObjectId],
      ref: "Trainer",
      default: [],
    },
    status: {
      type: String,
      enum: ["planned", "cancelled", "completed"],
      required: true,
      default: "planned",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Training: Model<TrainingDocument> =
  (models.Training as Model<TrainingDocument>) || model<TrainingDocument>("Training", trainingSchema);

// In dev HMR, existing mongoose models may keep the old schema shape.
if (!Training.schema.path("primaryTrainer")) {
  Training.schema.add({
    primaryTrainer: {
      type: Schema.Types.ObjectId,
      ref: "Trainer",
    },
  });
}

if (!Training.schema.path("coTrainers")) {
  Training.schema.add({
    coTrainers: {
      type: [Schema.Types.ObjectId],
      ref: "Trainer",
      default: [],
    },
  });
}

if (!Training.schema.path("coordinator")) {
  Training.schema.add({
    coordinator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  });
}

if (!Training.schema.path("cancelNote")) {
  Training.schema.add({
    cancelNote: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  });
}

if (!Training.schema.path("completionScore")) {
  Training.schema.add({
    completionScore: {
      type: Number,
      min: 1,
      max: 10,
    },
  });
}
