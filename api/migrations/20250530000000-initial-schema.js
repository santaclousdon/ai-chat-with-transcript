'use strict';

const fs = require('fs');
const path = require('path');

exports.up = function(db, callback) {
  const sqlPath = path.join(__dirname, 'sqls', '20250530000000-initial-schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  db.runSql(sql, callback);
};

exports.down = function(db, callback) {
  db.runSql(`
    DROP TABLE IF EXISTS messages;
    DROP TABLE IF EXISTS chat_sessions;
    DROP TABLE IF EXISTS transcripts;
  `, callback);
}; 