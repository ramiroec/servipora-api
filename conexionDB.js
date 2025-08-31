// conexionBD.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_QKshJIatg9F2@ep-super-glade-advuit7n-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

const pg = require('pg');
pg.types.setTypeParser(1114, function(stringValue) {
  return stringValue;  //1114 for time without timezone type
});

pg.types.setTypeParser(1082, function(stringValue) {
  return stringValue;  //1082 for date type
});

module.exports = pool;
