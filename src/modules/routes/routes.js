const express = require('express');
const router = express.Router();

const {
  createUsers,
} = require('../controllers/task.controller');


router.post('/createUsers', createUsers);

module.exports = router;