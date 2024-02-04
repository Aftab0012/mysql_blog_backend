const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogs.controller.js');

router.post('/', blogController.createBlog);
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getUsersBlogsById);
router.get('/blogDetails/:id', blogController.getBlogDetails);

module.exports = router;
