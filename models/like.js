'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
      Like.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Like.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    postId: { // postId, bukan post_id
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {  // userId, bukan user_id
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes'  //Gunakan huruf kapital
  });
  return Like;
};