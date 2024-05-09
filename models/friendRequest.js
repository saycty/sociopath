import { Mongoose, Schema } from "mongoose";

const requestSchema = Schema(
  {
    requestTo: { type: Schema.Types.ObjectId, ref: "Users" },
    requestFrom: { type: Schema.Types.ObjectId, ref: "Users" },
    requestStatus: { type: String, ref: "Pending" },
  },
  { timestamps: true }
);

const FriendRequest = Mongoose.model("FriendRequest", requestSchema);

export default FriendRequest;
