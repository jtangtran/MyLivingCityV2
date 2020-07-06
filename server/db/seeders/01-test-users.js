'use strict';

var Sequelize = require('sequelize');

/** 
 * Bulk inserts test users into "Users" table
*/

var testUsers = [
  {
    "email": "test1@email.com",
    "password": "test1",
    "fname": "Andy",
    "lname": "A",
    "Street_Name": "123 Road",
    "Postal_Code": "A1B 2C3",
    "role": 0,
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "email": "test2@email.com",
    "password": "test2",
    "fname": "Bob",
    "lname": "B",
    "Street_Name": "456 Road",
    "Postal_Code": "D4E 5F6",
    "role": 0,
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "email": "test3@email.com",
    "password": "test3",
    "fname": "Cindy",
    "lname": "C",
    "Street_Name": "789 Road",
    "Postal_Code": "G7H 8I9",
    "role": 0,
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "email": "test4@email.com",
    "password": "test4",
    "fname": "Darell",
    "lname": "D",
    "Street_Name": "123 Street",
    "Postal_Code": "B1C 2D3",
    "role": 0,
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "email": "test5@email.com",
    "password": "test5",
    "fname": "Eric",
    "lname": "E",
    "Street_Name": "456 Street",
    "Postal_Code": "E4F 5G6",
    "role": 0,
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "email": "test6@email.com",
    "password": "test6",
    "fname": "George",
    "lname": "G",
    "Street_Name": "789 Street",
    "Postal_Code": "H7I 8J9",
    "role": 0,
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "email": "test7@email.com",
    "password": "test7",
    "fname": "Horace",
    "lname": "H",
    "Street_Name": "123 Avenue",
    "Postal_Code": "C1D 2E3",
    "role": 0,
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "email": "test8@email.com",
    "password": "test8",
    "fname": "Irene",
    "lname": "I",
    "Street_Name": "456 Avenue",
    "Postal_Code": "F4G 5H6",
    "role": 0,
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "email": "test9@email.com",
    "password": "test9",
    "fname": "John",
    "lname": "J",
    "Street_Name": "789 Avenue",
    "Postal_Code": "I7J 8K9",
    "role": 0,
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
];

module.exports = {
  up: async function(queryInterface, Sequelize)
  {
    await queryInterface.bulkInsert('Users', testUsers);
  },
  down: function(queryInterface, Sequelize)
  {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
