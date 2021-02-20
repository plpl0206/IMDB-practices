const { Model, DataTypes, Sequelize } = require('sequelize');

class User extends Model {}

module.exports = (sequelize) => {
  User.init(
    {
      userId: {
        type: Sequelize.UUID,
        field: 'user_id',
        primaryKey: true,
        comment: 'user ID',
      },
      password: {
        type: DataTypes.STRING(128),
        allowNull: false,
        defaultValue: '',
        comment: 'password',
      },
      username: {
        type: DataTypes.STRING(150),
        allowNull: false,
        defaultValue: '',
        comment: "user's name",
      },
      email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
        defaultValue: '',
        comment: 'Email',
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
        comment: 'db record create time',
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        allowNull: false,
        comment: 'db record update time',
      },
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      timestamps: false,
      modelName: 'user',
      charset: 'utf8mb4',
      comment: 'IMDB comment user',
    },
  );

  return User;
};
