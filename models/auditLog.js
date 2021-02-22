const { Model, DataTypes, Sequelize } = require('sequelize');

class AuditLog extends Model {}

module.exports = (sequelize) => {
  AuditLog.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        comment: 'audit log id',
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: '',
        comment: 'user id',
      },
      movieId: {
        type: DataTypes.INTEGER.UNSIGNED,
        comment: 'movie id',
      },
      detail: {
        type: DataTypes.TEXT,
        comment: 'audit log detail',
      },
      operationTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
        comment: 'user operation time',
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
        comment: 'db record create time',
      },
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      timestamps: false,
      modelName: 'auditLog',
      charset: 'utf8mb4',
      comment: 'IMDB auditLog',
    },
  );
  return AuditLog;
};
