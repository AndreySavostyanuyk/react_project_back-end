const Users = require('../../db/models/task/index');

module.exports.allUsers = (req, res, next) => {
  Users.find().then(result => {
    res.send({ data: result })
  });
};

module.exports.createUsers = (req, res, next) => {
  const users = new Users(req.body);
  
    users.save().then(result1 => {
      Users.find().then(result => {
        res.send({ data: result })
      });
    });
};
