const Db = require('./Db');
const Setor = Db.sequelize.define('setores', {
    descricao: Db.Sequelize.DataTypes.STRING
},{
    timestamp: false
});

//Setor.sync()

module.exports = Setor;