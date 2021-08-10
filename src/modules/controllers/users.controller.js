const Users = require('../../db/models/task/index');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const secretKey = "mern-secret-key";

module.exports.allUsers = (req, res, next) => {
  Users.find().then(result => {
    res.send({ data: result })
  });
};

module.exports.createUsers = async(req, res, next) => {
  const { login, password } = req.body;

  if (typeof(login) !== 'string' 
    && !login 
    && !password) 
  {
    res.status(422).send('incorrect data');
  } else {
    const hashPassword = await bcrypt.hash(password, 8);
    const users = new Users({ login, password: hashPassword });
    const token = jwt.sign({ _id: users._id }, secretKey, { expiresIn: "1h" });

    users.save().then(result1 => {
      res.send({ token, result1 })
    });
  }
};