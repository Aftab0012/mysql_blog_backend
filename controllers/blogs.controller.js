const db = require('../db.js');

const createBlog = async (req, res) => {
  const { user_id, title, body } = req.body;
  try {
    const query = `INSERT INTO blogs
    (
        user_id,
        title,
        body
    ) VALUES (?,?,?)
    `;

    const blog = await db.query(query, [user_id, title, body]);
    res.status(201).json({ message: 'Blog created successfully.' });

    if (blog && blog[0] && blog[0].affectedRows > 0) {
      res.status(201).json({ message: `Registration Complete.` });
    } else {
      res.status(500).json({ error: `Failed to add a user` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const [allBlogs] = await db.query('SELECT * FROM blogs');
    if (allBlogs.length > 0) {
      res.status(200).json({ message: 'all blogs retrieved', allBlogs });
    } else {
      res.status(404).json({ error: 'Blogs fetching failed.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const getUsersBlogsById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
        SELECT * FROM users
        INNER JOIN blogs
        ON users.id = blogs.user_id
        WHERE users.id = ${id}
        `;
    const [userBlogs] = await db.query(query);
    console.log(userBlogs);
    if (userBlogs.length > 0) {
      res.status(200).json({ message: 'users blogs retrieved', userBlogs });
    } else {
      res.status(404).json({ error: 'No blogs found for this user.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getBlogDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
        SELECT users.first_name,blogs.title, blogs.body, users.last_name, users.location FROM users
        INNER JOIN blogs
        ON users.id = blogs.user_id
        WHERE blogs.id = ${id}
        `;

    const blogDetails = await db.query(query);
    if (blogDetails.length > 0) {
      res
        .status(200)
        .json({ message: 'blog details retrieved successfully', blogDetails });
    } else {
      res.status(404).json({ message: 'Failed to retrieve blog details.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getUsersBlogsById,
  getBlogDetails,
};
