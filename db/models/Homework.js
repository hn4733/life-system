module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Homework', {
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        due: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {});
}