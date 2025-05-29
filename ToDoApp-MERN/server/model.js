const mongoose = require('mongoose');

const toDoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ToDo = mongoose.model('ToDo', toDoSchema);
module.exports = ToDo;
