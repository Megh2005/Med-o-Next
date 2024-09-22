import mongoose, { Document, Schema } from "mongoose";

export interface Invitation extends Document {
  sender: string;
  recipient: string;
  status: "pending" | "accepted" | "unsent";
}

const invitationSchema: Schema<Invitation> = new Schema<Invitation>(
  {
    sender: { type: Schema.Types.String, ref: "User", required: true },
    recipient: { type: Schema.Types.String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export const InvitationModel =
  (mongoose.models.Invitation as mongoose.Model<Invitation>) ||
  mongoose.model("Invitation", invitationSchema);
