const { DataTypes, Model } = require('sequelize');
const Db = require('./Db');

class Gestor extends Model {}

Gestor.init({
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    senha: DataTypes.STRING,
    foto: DataTypes.STRING,
    idSetor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'setores',
            key: 'id'
        }
    },
    idCargo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'cargos',
            key: 'id'
        }
    }
}, {
    sequelize: Db.sequelize,
    modelName: 'gestores',
    // Configuração para deletar em cascata
    onDelete: 'CASCADE'
});

Gestor.sync();

module.exports = Gestor;