const Db = require('./Db');

//Module imports
const Gestor = require('./Gestor');


const Colaborador = Db.sequelize.define('colaboradores', {
    nome: Db.Sequelize.DataTypes.STRING,
    email: Db.Sequelize.DataTypes.STRING,
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
    },
    idGestor:{
        type: Db.Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'gestores',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
});

Colaborador.sync({force: false});

module.exports = Colaborador;