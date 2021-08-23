const Users = require('../../db/models/task/index');
const Records = require('../../db/models/records/index');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const secretKey = "mern-secret-key";

module.exports.allRecords = (req, res, next) => {
  token = req.headers["token"];

  const decoded = jwt.decode(token);
  const textId = decoded._id ;
  const uniqRecords = Records.find({ userId: textId })
  
  uniqRecords.find().then(result => {
    res.send({ data: result })
  });
};

module.exports.createUsers = async(req, res, next) => {
  const {_id, login, password } = req.body;
  const uniqUser = await Users.findOne({ login })
  
  if (uniqUser) {
    return res.status(400).send(`User with ${login} exist`);
  }

  if (typeof(login) !== 'string' 
    && !login 
    && !password) 
  {
    return res.status(422).send('incorrect data');
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
  const users = await Users.findOne({ login });
  
  if (!users) {
    return res.status(404).send('Такого пользователя не существует');
  }

  const isPassValid = bcrypt.compareSync(password, users.password)

  if (!isPassValid) {
    return res.status(404).send('неверно введен логин или пароль');
  }

  const token = jwt.sign({ _id: users._id  }, secretKey, { expiresIn: "1h" });

  if (!token) {
    return res.status(401).send('token does not exist');
  }

  if (typeof(login) === 'string' 
      && login
      && password
  ){
    users.save().then(result1 => {
      res.send({ token, result1 })
    });
  } else {
    return res.status(404).send('Sorry cant find that!');
  };
};

module.exports.createRecords = async(req, res, next) => {
  const { userId, name, doctor, date, complaints } = req.body;

  if (typeof(name) !== 'string' 
    && typeof(doctor) !== 'string' 
    && typeof(complaints) !== 'string' 
    && !name 
    && !doctor
    && !complaints) 
  {
    return res.status(422).send('incorrect data');
  } else {
    const decoded = jwt.decode(userId);
    const textId = decoded._id ;
    
    const records = new Records({ userId: textId, name, doctor, date, complaints });
    const uniqRecords = Records.find({ userId: textId })

    records.save().then(result1 => {
      uniqRecords.find().then(result => {
        res.send({ data: result })
      });
    });
  }
};

module.exports.deleteRecords = (req, res, next) => {
  token = req.headers["token"];

  const decoded = jwt.decode(token);
  const textId = decoded._id ;
  const uniqRecords = Records.find({ userId: textId })

  uniqRecords.deleteOne({
    _id: req.query._id
  }).then(result => {
    uniqRecords.find().then(result => {
      res.send({ data: result })
    });
  });
};  

module.exports.editRecords = (req, res, next) => {
  token = req.headers["token"];

  if (!token) {
    return res.status(401).send('token does not exist');
  }

  const decoded = jwt.decode(token);
  const textId = decoded._id ;
  const uniqRecords = Records.find({ userId: textId })

  if (typeof(req.body.name) === 'string'
      && typeof(req.body.doctor) === 'string' 
      && typeof(req.body.complaints) === 'string' 
      && req.body.name
      && req.body.doctor
      && req.body.complaints) {
    Records.updateOne({ _id: req.query._id }, req.body).then(result1 => {
      uniqRecords.find().then(result => {
        res.send({ data: result })
      });
    });
  } else {
    res.status(404).send('Sorry cant find that!');
  };
}