const Sequelize = require('sequelize');
const sequelize = new Sequelize('vigillatus', 'root', '', {
    host:'localhost',
    dialect: 'mysql'
});

/* const Auth = async ()=>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('DEU ERRO:', error);
      }
}

console.log(Auth()); */

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}