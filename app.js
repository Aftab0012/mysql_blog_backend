require('dotenv').config();

const express = require('express');
const app = express();
const db = require('./db.js');
const userRoutes = require('./routes/user.routes.js');
const blogRoutes = require('./routes/blogs.routes.js');

const bodyParser = require('body-parser');
app.use(express.json());
const PORT = 3006;

app.use('/api/user', userRoutes);
app.use('/api/blog', blogRoutes);

db.query('SELECT 1')
  .then(() => {
    console.log('Connection to db succeeded');
    app.listen(3004, () => {
      console.log('Server started on port 3006');
    });
  })
  .catch((err) => {
    console.log('DB connection failed', err);
    app.listen(3004, () => {
      console.log('Server started on port 3006');
    });
  });

app.listen(PORT, () => {
  console.log(`Server runing on port ${PORT}`);
});
