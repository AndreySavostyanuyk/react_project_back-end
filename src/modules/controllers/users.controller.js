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

module.exports.loginUsers = async(req, res, next) => {
  const { login, password } = req.body;
  const users = await Users.findOne({ login })
  
  if (!users) {
    res.status(404).send('Users not found');
  }

  const isPassValid = bcrypt.compareSync(password, users.password)

  if (!isPassValid) {
    res.status(400).send('Invalid password');
  }

  const token = jwt.sign({ _id: users._id }, secretKey, { expiresIn: "1h" });

  if (typeof(login) === 'string' 
      && login
      && password
      ) {
    users.save().then(result1 => {
      res.send({ token, result1 })
    });
  } else {
    res.status(404).send('Sorry cant find that!');
  };
};