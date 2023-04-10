import mongoose from "mongoose";

const MessageSchema = mongoose.Schema(
  {
    chatId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: { type: String },
  },
  { timestamps: true }
);

const messageModel = mongoose.model("Message", MessageSchema);
export default messageModel;
