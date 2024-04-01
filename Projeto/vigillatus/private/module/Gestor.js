const Db = require('./Db');

const Gestor = Db.sequelize.define('gestores', {
    nome: Db.Sequelize.DataTypes.STRING,
    email: Db.Sequelize.DataTypes.STRING,
    senha: Db.Sequelize.DataTypes.STRING,
    foto: Db.Sequelize.DataTypes.STRING,
    idSetor:{
        type: Db.Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'setores',
            key: 'id'
        }
    },
    idCargo:{
        type: Db.Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'cargos',
            key: 'id'
        }
    }
});

Gestor.sync();

module.exports = Gestor;