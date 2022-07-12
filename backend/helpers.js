const mariadb = require('mariadb');
const config = require('./config');


//Returns a random number between min (inclusive) and max (exclusive)
function between(min, max) {
    return Math.floor(
      Math.random() * (max - min) + min
    )
}

const pool_connections = mariadb.createPool({
  connectionLimit: 5,
  host : config.Config.MYSQL.HOST,
  database : config.Config.MYSQL.DATABASE,
  user : config.Config.MYSQL.USER,
  password : config.Config.MYSQL.PASSWORD,
  socketPath: config.Config.MYSQL.SOCKET_PATH
});

module.exports.between = between;
module.exports.pool_connections = pool_connections;
