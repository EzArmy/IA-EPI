const Db = require('./Db');

const Norma = Db.sequelize.define('normas', {
    descricao: Db.Sequelize.DataTypes.STRING,
    textoNotificacao: Db.Sequelize.DataTypes.STRING
});

Norma.sync({ force: false });

module.exports = Norma;