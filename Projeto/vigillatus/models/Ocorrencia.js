const Db = require('./Db');
const Camera = require('./Camera');
const Colaborador = require('./Colaborador');
const Gestor = require('./Gestor');
const Setor = require('./Setor');

const Ocorrencia = Db.sequelize.define('ocorrencias', {
    data: Db.Sequelize.DataTypes.DATE,
    hora: Db.Sequelize.DataTypes.TIME,
    foto: Db.Sequelize.DataTypes.STRING,
    situacao: Db.Sequelize.DataTypes.SMALLINT,
    idCamera: {
        type: Db.Sequelize.DataTypes.INTEGER,
        references: {
            model: 'cameras',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    idColaborador: {
        type: Db.Sequelize.DataTypes.INTEGER,
        references: {
            model: 'colaboradores',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    idGestorNotificante: {
        type: Db.Sequelize.DataTypes.INTEGER,
        references: {
            model: 'gestores',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    idSetor: {
        type: Db.Sequelize.DataTypes.INTEGER,
        references: {
            model: 'setores',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    dataNotificacao: Db.Sequelize.DataTypes.DATE
});

// Definindo as associações
Ocorrencia.belongsTo(Camera, { foreignKey: 'idCamera', onDelete: 'CASCADE' });
Ocorrencia.belongsTo(Colaborador, { foreignKey: 'idColaborador', onDelete: 'CASCADE' });
Ocorrencia.belongsTo(Gestor, { foreignKey: 'idGestorNotificante', onDelete: 'CASCADE' });
Ocorrencia.belongsTo(Setor, { foreignKey: 'idSetor', onDelete: 'CASCADE' });

Ocorrencia.sync({ force: false });

module.exports = Ocorrencia;