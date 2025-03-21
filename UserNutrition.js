//models/UserNutrition.js
// Hapus: const sequelize = require('.').sequelize;

// Ubah menjadi function yang menerima sequelize
module.exports = (sequelize, DataTypes) => {
    const UserNutrition = sequelize.define('UserNutrition', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Nama tabel, bukan nama model
                key: 'id',
            },
        },
        nutrition_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'nutritions', // Nama tabel, bukan nama model
                key: 'id',
            },
        },
        lastshown: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'user_nutritions',
        timestamps: false,
    });
    return UserNutrition;
  };