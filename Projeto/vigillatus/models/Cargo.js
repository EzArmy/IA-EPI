const Db = require('./Db');
const Cargo = Db.sequelize.define('cargos', {
    nome: Db.Sequelize.DataTypes.STRING,
    nivel: Db.Sequelize.DataTypes.SMALLINT
});

//Cargo.sync()

module.exports = Cargo;