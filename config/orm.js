// Import Node Dependencies
var connection = require("./connection.js");

// Methods for MySQL commands
var orm = {

  selectAll: function (callback) {
    // Run MySQL Query
    connection.query('SELECT * FROM burgers ',
      function (err, data) {
        if (err) throw err;
        callback(data);
      });
  },

  //InsertOne()
  insertOne: function (burger_name, callback) {
    connection.query("INSERT INTO burgers (burger_name) VALUES (?)",
      [burger_name], function (err, data) {
        if (err) throw err;
        callback(data);
      });
  },

  //updateOne()
  updateOne: function (burgerID, callback) {
    // Run MySQL Query
    connection.query('UPDATE burgers SET ? WHERE ?', [{ devoured: true }, { id: burgerID }], function (err, data) {
      if (err) throw err;
      callback(data);
    });
  }
}

module.exports = orm;
