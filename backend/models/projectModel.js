const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], // Array of task references
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
