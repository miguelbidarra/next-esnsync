import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const eventSchema = new Schema(
  {
    name: String,
    description: String,
    date: String,
    department: String,
    location: String,
    //budget: ,  // Budget for the event
    mo: { type: Schema.Types.ObjectId, ref: "MO" },  // Reference to MO
    oc: [
      {
        id: { type: Schema.Types.ObjectId, ref: "User" },
        name: String,
      },
    ],
    status: { type: String, enum: ["Available", "Full"], default: "Available" },  // Status flag
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
