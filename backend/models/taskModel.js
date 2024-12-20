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
    dueDate: { type: Date },
    status: { type: String, default: "pending" },
    assignedTo : {type : String},
    createdBy: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Task", taskSchema)
