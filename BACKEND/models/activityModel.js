const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const activitySchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },

    taskTitle: {
      type: String,
      required: true,
    },

    action: {
      type: String,
      enum: [
        "created",
        "completed",
        "uncompleted",
        "edited",
        "deleted",
        "restored",
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
