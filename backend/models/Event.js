const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  position: { type: String, enum: ["left", "right"], default: "right" },
  bgColor: { type: String, default: "bg-white" },
  textColor: { type: String, default: "#374151" },
  images: [
    {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", eventSchema);