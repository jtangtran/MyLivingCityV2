'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { 
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
    Street_Name: DataTypes.STRING,
    Postal_Code: DataTypes.STRING,
    location: DataTypes.STRING,
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL,
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
    }
  });
  User.prototype.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
  User.prototype.generateJWT = function() {
    return jwt.sign({
        email: this.email,
        id: this.id,
    }, 'secret', { expiresIn: '30d'} );
  };
  User.prototype.toAuthJSON = function() {
    return {
        id: this.id,
        email: this.email,
        fname: this.fname,
        lname: this.lname,
        Street_Name: this.Street_Name,
        Postal_Code: this.Postal_Code,
        location: this.location,
        latitude: this.latitude,
        longitude: this.longitude,
        role: this.role,
        token: this.generateJWT(),
    };
  };

  User.associate = function(models) {
    // associations can be defined here
  };

  User.beforeCreate((user, options) => {
    return cryptPassword(user.password)
    .then(success => {
        user.password = success;
    })
    .catch(err => {
        if (err) console.log(err);
    });
  });    

  function cryptPassword(password) {
    return new Promise(function(resolve, reject) {
        bcrypt.hash(password, 10, function(err, hash) {
            if (err) return reject(err);
            return resolve(hash);
        });
    });  
  };

  return User;
};
