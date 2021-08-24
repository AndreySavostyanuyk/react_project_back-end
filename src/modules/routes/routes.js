const express = require('express');
const router = express.Router();

const {
  createUsers,
  loginUsers,
  createRecords,
  allRecords,
  deleteRecords,
  editRecords
} = require('../controllers/users.controller');

router.get('/allRecords', allRecords);
router.post('/createUsers', createUsers);
router.post('/loginUsers', loginUsers);
router.post('/createRecords', createRecords);
router.patch('/editRecords', editRecords);
router.delete('/deleteRecords', deleteRecords);

module.exports = router;