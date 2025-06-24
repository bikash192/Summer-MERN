const bcrypt= require('bcrypt');
const Users = require('../model/Users');
bcrypt.hash('admin', 10).then(console.log);