// models/Nutrition.js
// Hapus: const sequelize = require('.').sequelize;

// Ubah menjadi function yang menerima sequelize
module.exports = (sequelize, DataTypes) => { // Tambahkan ini
    const Nutrition = sequelize.define('Nutrition', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            trim: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        list: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
        },
        tip: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        tableName: 'nutritions',
        timestamps: true,
        createdAt: 'createdat',
        updatedAt: 'updatedat'
    });
  
    Nutrition.associate = (models) => {
        Nutrition.belongsToMany(models.User, {
            through: models.UserNutrition,
            foreignKey: 'nutritionid',
            otherKey: 'user_id',
            as: 'users',
        });
    };
  
    return Nutrition; // Tambahkan ini
  };