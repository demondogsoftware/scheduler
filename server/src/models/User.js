const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));

function hashPassword (user, options) {
  if (!user.changed('password')) {
    return
  }
  return bcrypt.hash(user.password, 10, null)
    .then(hash => {
      user.setDataValue('password', hash)
    })
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    admin: DataTypes.BOOLEAN,
    employee: DataTypes.BOOLEAN
    }, {
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword
    }
  })
  User.prototype.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
  };
  return User
}
