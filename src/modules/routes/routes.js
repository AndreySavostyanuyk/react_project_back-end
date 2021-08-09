const express = require('express');
const router = express.Router();

const {
  allUsers,
  createUsers,
} = require('../controllers/users.controller');

router.get('/allUsers', allUsers);
router.post('/createUsers', createUsers);

module.exports = router;