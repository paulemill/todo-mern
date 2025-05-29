const mongoose = require('mongoose');
const ToDos = require('../model.js');

/////////////////////////////////////////
// Get all ToDos
/////////////////////////////////////////

const getTodos = async (req, res) => {
  try {
    const allTodos = await ToDos.find({}).sort({ createdAt: -1 });
    res.status(200).send(allTodos);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

/////////////////////////////////////////
// Create To Do
/////////////////////////////////////////

const createTodo = async (req, res) => {
  const { text } = req.body; // Get the To Do from the request body

  try {
    const newToDo = new ToDos({
      text,
      completed: false,
    });

    const savedToDo = await newToDo.save(); // Create a new To Do
    res.status(200).send(savedToDo);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/////////////////////////////////////////
// Update To Do
/////////////////////////////////////////

const toggleTodo = async (req, res) => {
  const { id } = req.params; // Get the ID from the request parameters
  const { completed } = req.body;
  try {
    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send({ message: 'No such To Do' });
    }

    const updatedTodo = await ToDos.findOneAndUpdate(
      { _id: id },
      { completed },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).send({ message: 'No such To Do' });
    }

    res.status(200).json(updatedTodo); // Send the updated document back
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/////////////////////////////////////////
// Delete To Do
/////////////////////////////////////////

const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send({ message: 'No such To Do' });
    }

    const deletedTodo = await ToDos.findOneAndDelete({ _id: id });

    if (!deletedTodo) {
      return res.status(404).send({ message: 'No such To Do' });
    }

    res.status(200).json(deletedTodo); // ✅ Return the deleted todo (optional)
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/////////////////////////////////////////
// Edit To Do
/////////////////////////////////////////

const editTodo = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'No such To Do' });
  }

  try {
    const updatedTodo = await ToDos.findByIdAndUpdate(
      { _id: id },
      { text },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'No such To Do' });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTodos,
  createTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
};
