const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('test', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3308,
  logging: false,
  raw: true

});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}


module.exports = connectDB;