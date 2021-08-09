const Users = require('../../db/models/task/index');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
let secretKey = "mern-secret-key";

module.exports.allUsers = async(req, res, next) => {
  Users.find().then(result => {
    res.send({ data: result })
  });
};

module.exports.createUsers = async(req, res, next) => {
  const {Login, Password} = await req.body;
  const hashPassword = await bcrypt.hash(Password, 8);
  const users = new Users({ Login, Password: hashPassword });
  const token = jwt.sign({_id: users._id}, secretKey, {expiresIn: "1h"});

  if (typeof(Login) === 'string' 
      && Login
      && Password
      ) {
    users.save().then(result1 => {
        res.send({ token, result1 })
    });
  } else {
    res.status(404).send('Sorry cant find that!');
  };
};
