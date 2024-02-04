const db = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getAllUsers = async (req, res) => {
  try {
    const [records] = await db.query('SELECT * FROM users');
    console.log(records);
    res.status(200).json({ records });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
    throw new error();
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [[records]] = await db.query('SELECT * FROM users WHERE id = ?', [
      id,
    ]);
    console.log(records);
    if (records === undefined) {
      res.status(404).json({ error: `User with given id ${id} not found.` });
    }
    res.status(200).json({ records });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
    throw new error();
  }
};

const registerUser = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    location,
    is_admin,
    dept,
    age,
  } = req.body;
  try {
    const query = `INSERT INTO users
    (
    first_name,
    last_name,
    email,
    password,
    location,
    is_admin,
    register_date,
    dept,
    age
    )
    VALUES (?,?,?,?,?,?,NOW(),?,?)
    `;

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Hashed Password: ${hashedPassword}`);

    const result = await db.query(query, [
      first_name,
      last_name,
      email,
      hashedPassword,
      location,
      is_admin,
      dept,
      age,
    ]);

    console.log([{ result }].affectedRows);

    if (result && result[0] && result[0].affectedRows > 0) {
      res.status(201).json({ message: `Registration Complete.` });
    } else {
      res.status(500).json({ error: `Failed to add a user` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    const user = await db.query(query, [email]);
    const [[[userdetails]]] = [user];

    if (user[0].length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const storedHashedPassword = user[0][0].password;
    const comparePassword = await bcrypt.compare(
      password,
      storedHashedPassword
    );

    if (comparePassword) {
      const token = jwt.sign({ email }, process.env.SECRET_KEY, {
        expiresIn: '3650d',
      });
      res.status(200).json({
        message: 'Login successful.',
        user: {
          id: userdetails.id,
          name: userdetails.first_name,
          token: token,
        },
      });
    } else {
      res.status(400).json({ error: 'Incorrect Credentials' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { getAllUsers, getUserById, registerUser, loginUser };
