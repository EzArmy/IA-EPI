const Db = require('./Db');
const Setor = require('./Setor');

const Camera = Db.sequelize.define('cameras', {
    descricao: Db.Sequelize.DataTypes.STRING,
    idSetor: {
        type: Db.Sequelize.DataTypes.INTEGER,
        references: {
            model: 'setores',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
});

// Definindo as associações
Camera.belongsTo(Setor, { foreignKey: 'idSetor', onDelete: 'CASCADE' });

Camera.sync({ force: false });

module.exports = Camera;