// models/report.js
'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      // Relasi ke Post (postingan yang dilaporkan)
      Report.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });

      // TIDAK ADA relasi ke Comment (karena kita menghapus commentId)

      // Relasi ke User (user yang MELAPORKAN)
      Report.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

      // Relasi ke User (user yang DIPOSTINGANNYA dilaporkan)
      Report.belongsTo(models.User, {
        foreignKey: 'reportedUserId',
        as: 'reportedUser', //  <--  Alias yang berbeda
      });
    }
  }
  Report.init({
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false, //  Postingan yang dilaporkan HARUS ADA
    },
    // Hapus commentId
    // commentId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true
    // },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false, //  User yang melaporkan HARUS ADA
    },
    reportedUserId: {
      type: DataTypes.INTEGER,
      allowNull: false, // User yang postingannya yang dilaporkan HARUS ADA
    },
    reason: {
      type: DataTypes.TEXT, //  Menggunakan TEXT untuk alasan yang fleksibel
      allowNull: false,  //  Alasan laporan HARUS diisi
    },
    status: { // Opsional
      type: DataTypes.ENUM('pending', 'reviewed', 'resolved', 'rejected'),
      defaultValue: 'pending',
      allowNull: false  //  Boleh NULL atau NOT NULL, tergantung kebutuhan
    },
  }, {
    sequelize,
    modelName: 'Report',
    tableName: 'Reports' //  Nama tabel di database
  });
  return Report;
};