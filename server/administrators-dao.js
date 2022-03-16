'use strict';
/* Data Access Object (DAO) module for accessing administrators */
const sqlite = require('sqlite3');
// open the database
const db = new sqlite.Database('./surveys.db', (err) => {
  if (err) throw err;
});
const bcrypt = require('bcrypt');


exports.getAdminById = (id) => {
  return new Promise((resolve, reject) => {

    const sql = 'SELECT * FROM administrators WHERE id_admin = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      }
      else if (row === undefined)
        resolve({ error: 'User not found.' });
      else {
        // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
        let user = { id: row.id_admin, username: row.email, name: row.name }
        resolve(user);
      }
    });
  });
};

exports.getAdmin = (email, password) => {
  return new Promise((resolve, reject) => {

    const sql = 'SELECT * FROM administrators WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined) {
        resolve(false);
      }
      else {
        let user = { id: row.id_admin, username: row.email, name: row.name };

        // check the hashes with an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
        bcrypt.compare(password, row.hash).then(result => {
          if (result)
            resolve(user);
          else
            resolve(false);
        });
      }
    });
  });
};