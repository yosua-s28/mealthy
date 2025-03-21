'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, { foreignKey: 'userId', as: 'posts' });
      User.hasMany(models.Comment, { foreignKey: 'userId', as: 'comments' });
      User.hasMany(models.Like, { foreignKey: 'userId', as: 'likes' });
    }
  }
  User.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: { //  <--  Kembali ke username
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: { //  <--  Tambahkan firstName
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    profileImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  });
  return User;
};