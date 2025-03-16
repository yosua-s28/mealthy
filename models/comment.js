'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
      Comment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Comment.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    text: DataTypes.TEXT,
    postId: { // postId, bukan post_id
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: { // userId, bukan user_id
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'Comments' // Gunakan huruf kapital
  });
  return Comment;
};