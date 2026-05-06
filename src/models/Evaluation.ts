import { Model, Schema, model, models } from "mongoose";

export type EvaluationDocument = {
  trainer: Schema.Types.ObjectId;
  training: Schema.Types.ObjectId;
  score: number;
  createdAt: Date;
  updatedAt: Date;
};

const evaluationSchema = new Schema<EvaluationDocument>(
  {
    trainer: {
      type: Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },
    training: {
      type: Schema.Types.ObjectId,
      ref: "Training",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

evaluationSchema.index({ trainer: 1, training: 1 }, { unique: true });

export const Evaluation: Model<EvaluationDocument> =
  (models.Evaluation as Model<EvaluationDocument>) ||
  model<EvaluationDocument>("Evaluation", evaluationSchema);
