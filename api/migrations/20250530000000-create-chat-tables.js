'use strict';

const fs = require('fs');
const path = require('path');

exports.up = function(db, callback) {
  const sqlPath = path.join(__dirname, 'sqls', '20250530000000-create-chat-tables-up.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  db.runSql(sql, callback);
};

exports.down = function(db, callback) {
  const sqlPath = path.join(__dirname, 'sqls', '20250530000000-create-chat-tables-down.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  db.runSql(sql, callback);
}; 