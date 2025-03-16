'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.hasMany(models.Comment, { foreignKey: 'postId', as: 'comments' });
      Post.hasMany(models.Like, { foreignKey: 'postId', as: 'likes' });
      Post.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Post.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      text: DataTypes.TEXT, // TEXT untuk deskripsi panjang
      images: DataTypes.STRING(255), // Atau TEXT, jika URL bisa sangat panjang
      recipe: DataTypes.JSONB,
      userId: { // userId, bukan user_id
        type: DataTypes.INTEGER,
        allowNull: true, // Tidak boleh null, karena setiap post harus punya user
        // tapi karena mau test si communitynya doang dulu makanya dijadiin true, nanti harus diubah lagi di database
      },
  }, {
    sequelize,
    modelName: 'Post',
    tableName: 'Posts', // Perhatikan huruf besar 'P'
  });
  return Post;
};