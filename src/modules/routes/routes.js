const express = require('express');
const router = express.Router();

const {
  allUsers,
  createUsers,
  loginUsers
} = require('../controllers/users.controller');

router.get('/allUsers', allUsers);
router.post('/createUsers', createUsers);
router.post('/loginUsers', loginUsers);

module.exports = router;