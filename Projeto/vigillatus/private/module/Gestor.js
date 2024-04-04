const Db = require('./Db');
const Setor = require('./Setor');
const Cargo = require('./Cargo');
const Colaborador = require('./Colaborador');

const Gestor = Db.sequelize.define('gestores', {
    nome: Db.Sequelize.DataTypes.STRING,
    email: Db.Sequelize.DataTypes.STRING,
    senha: Db.Sequelize.DataTypes.STRING,
    foto: Db.Sequelize.DataTypes.STRING,
    idSetor: {
        type: Db.Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'setores',
            key: 'id',
            onDelete:'CASCADE'
        }
    },
    idCargo: {
        type: Db.Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'cargos',
            key: 'id',
            onDelete:'CASCADE'
        }
    }
});

// Definindo as associações
Gestor.belongsTo(Setor, { foreignKey: 'idSetor', onDelete: 'CASCADE' });
Gestor.belongsTo(Cargo, { foreignKey: 'idCargo', onDelete: 'CASCADE' });
Gestor.hasMany(Colaborador, { foreignKey: 'idGestor', onDelete: 'CASCADE' });

/* Gestor.sync(); */

module.exports = Gestor;