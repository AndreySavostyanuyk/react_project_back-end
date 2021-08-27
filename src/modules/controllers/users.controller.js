const Users = require('../../db/models/task/index');
const Records = require('../../db/models/records/index');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const secretKey = "mern-secret-key";

module.exports.allRecords = (req, res, next) => {
  token = req.headers["token"];

  const decoded = jwt.decode(token);
  const textId = decoded._id;
  
  Records.find({ userId: textId }).then(result => {
    res.send({ data: result })
  });
};

module.exports.createUsers = async(req, res, next) => {
  const {_id, login, password } = req.body;
  const uniqUser = await Users.findOne({ login });
  
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
    return res.status(404).send('This user does not exist');
  }

  const isPassValid = bcrypt.compareSync(password, users.password)

  if (!isPassValid) {
    return res.status(404).send('username or password entered incorrectly');
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
  const { token, name, doctor, date, complaints } = req.body;

  if (typeof(name) !== 'string' 
    && typeof(doctor) !== 'string' 
    && typeof(complaints) !== 'string' 
    && typeof(date) !== 'string' 
    && !date
    && !name 
    && !doctor
    && !complaints) 
  {
    return res.status(422).send('incorrect data');
  } else {
    const decoded = jwt.decode(token);
    const textId = decoded._id ;
    
    const records = new Records({ userId: textId, name, doctor, date, complaints });

    records.save().then(result1 => {
      Records.find({ userId: textId }).then(result => {
        res.send({ data: result })
      });
    });
  }
};

module.exports.deleteRecords = (req, res, next) => {
  token = req.headers["token"];

  if (!token) {
    return res.status(401).send('token does not exist');
  }

  if (!req.query._id) {
    return res.status(404).send('This id does not exist');
  }

  const decoded = jwt.decode(token);
  const textId = decoded._id ;

  Records.deleteOne({
    _id: req.query._id
  }).then(result => {
    Records.find({ userId: textId }).then(result => {
      res.send({ data: result })
    });
  });
};  

module.exports.editRecords = (req, res, next) => {
  const { _id, name, doctor, date, complaints } = req.body;
  const token = req.headers["token"];

  if (!token) {
    return res.status(401).send('token does not exist');
  }

  const decoded = jwt.decode(token);
  const textId = decoded._id ;

  if (typeof(name) === 'string'
      && typeof(doctor) === 'string' 
      && typeof(complaints) === 'string' 
      && typeof(date) === 'string' 
      && _id
      && name
      && date
      && doctor
      && complaints) {
    Records.updateOne({ _id }, req.body).then(result1 => {
      Records.find({ userId: textId }).then(result => {
        res.send({ data: result })
      });
    });
  } else {
    res.status(404).send('Sorry cant find that!');
  };
}

module.exports.filterRecords = (req, res, next) => {
  const { withdate, ondate } = req.body;

  if (!withdate && !ondate) {
    return res.status(401).send('data not found');
  }

  if (withdate && !ondate) {
    Records.find({ date: {$gte: withdate} }).then(result => {
      res.send({ data: result })
    });
  } else if (!withdate && ondate) {
    Records.find({ date: {$lte: ondate} }).then(result => {
      res.send({ data: result })
    });
  } else if (withdate && ondate) {
    Records.find({ date: {$gte: withdate, $lte: ondate} }).then(result => {
      res.send({ data: result })
    });
  }
}

module.exports.sortedRecords = (req, res, next) => {
  const { textsort, direction } = req.body;

  if (!textsort && !direction) {
    return res.status(401).send('data not found');
  }

  if (textsort === "Name") {
    if (direction === "Asc") {
      Records.find().sort({name: 1}).then(result => {
        res.send({ data: result })
      });
    }

    if (direction === "Desc") {
      Records.find().sort({name: -1}).then(result => {
        res.send({ data: result })
      });
    }
  } else if (textsort === "Doctor") {
    if (direction === "Asc") {
      Records.find().sort({doctor: 1}).then(result => {
        res.send({ data: result })
      });
    }

    if (direction === "Desc") {
      Records.find().sort({doctor: -1}).then(result => {
        res.send({ data: result })
      });
    }
  } else if (textsort === "Date") {
    if (direction === "Asc") {
      Records.find().sort({date: 1}).then(result => {
        res.send({ data: result })
      });
    }

    if (direction === "Desc") {
      Records.find().sort({date: -1}).then(result => {
        res.send({ data: result })
      });
    }
  } 
}