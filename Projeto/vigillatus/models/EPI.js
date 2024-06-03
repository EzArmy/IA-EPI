const Db = require('./Db');

const EPI = Db.sequelize.define('epis', {
    descricao: Db.Sequelize.DataTypes.STRING
});

EPI.sync({ force: false });

module.exports = EPI;