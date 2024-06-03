const Db = require('./Db');
const Setor = require('./Setor');
const EPI = require('./EPI');

const SetorEpi = Db.sequelize.define('setor_epis', {
    idSetor: {
        type: Db.Sequelize.DataTypes.INTEGER,
        references: {
            model: 'setores',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    idEpi: {
        type: Db.Sequelize.DataTypes.INTEGER,
        references: {
            model: 'epis',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    risco: Db.Sequelize.DataTypes.SMALLINT
});

// Definindo as associações
SetorEpi.belongsTo(Setor, { foreignKey: 'idSetor', onDelete: 'CASCADE' });
SetorEpi.belongsTo(EPI, { foreignKey: 'idEpi', onDelete: 'CASCADE' });

SetorEpi.sync({ force: false });

module.exports = SetorEpi;