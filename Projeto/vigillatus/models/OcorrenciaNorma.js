const Db = require('./Db');
const Ocorrencia = require('./Ocorrencia');
const Norma = require('./Norma');

const OcorrenciaNorma = Db.sequelize.define('ocorrencia_normas', {
    idOcorrencia: {
        type: Db.Sequelize.DataTypes.INTEGER,
        references: {
            model: 'ocorrencias',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    idNorma: {
        type: Db.Sequelize.DataTypes.INTEGER,
        references: {
            model: 'normas',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
});

// Definindo as associações
OcorrenciaNorma.belongsTo(Ocorrencia, { foreignKey: 'idOcorrencia', onDelete: 'CASCADE' });
OcorrenciaNorma.belongsTo(Norma, { foreignKey: 'idNorma', onDelete: 'CASCADE' });

OcorrenciaNorma.sync({ force: false });

module.exports = OcorrenciaNorma;
