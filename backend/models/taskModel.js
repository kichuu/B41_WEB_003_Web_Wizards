const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: "pending" },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    user: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Task", taskSchema)
