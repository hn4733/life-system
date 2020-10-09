module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Todo', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        due: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {});
}