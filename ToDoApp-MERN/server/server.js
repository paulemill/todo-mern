const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const {
  getTodos,
  createTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
} = require('./controllers/toDoControllers');

/////////////////////////////////////////
// App Configuration
/////////////////////////////////////////
const app = express();
const PORT = process.env.PORT || 8000;
const connectionURl = process.env.MONGO_URI;

/////////////////////////////////////////
// Serve static files from React
/////////////////////////////////////////
app.use(express.static(path.join(__dirname, '../client/ToDoApp/dist')));

/////////////////////////////////////////
// Middlewares
/////////////////////////////////////////
app.use(express.json());
const allowedOrigins = [
  'http://localhost:5173',
  'https://todoapp-mern-ryxy.onrender.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'CORS policy does not allow access from this origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

/////////////////////////////////////////
// DB Configuration
/////////////////////////////////////////
mongoose
  .connect(connectionURl)
  .then(() => {
    // ✅ Start server only after successful DB connection
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((error) => console.log(error));

/////////////////////////////////////////
// API endpoints
/////////////////////////////////////////

// Get all ToDos
app.get('/todos', getTodos);

// Create a new Todo
app.post('/todos', createTodo);

// Toggle Todo
app.patch('/todos/:id/toggle', toggleTodo);

// Edit Todo
app.patch('/todos/:id', editTodo);

// Delete Todo
app.delete('/todos/:id', deleteTodo);
