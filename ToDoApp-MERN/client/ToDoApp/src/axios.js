import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://todo-mern-backend-7xk8.onrender.com',
});

export default instance;
