const { Model, DataTypes, Sequelize } = require('sequelize');

class Comment extends Model {}

module.exports = (sequelize) => {
  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Comment id',
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: '',
        comment: 'user id',
      },
      movie_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: 'user id',
      },
      comment: {
        type: DataTypes.TEXT,
        comment: 'movie comment',
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 4,
        },
        comment: 'movie rating',
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
      timestamps: true,
      modelName: 'comment',
      charset: 'utf8mb4',
      indexes: [
        { fields: ['user_id'], name: 'idx_userId' },
        { fields: ['movie_id'], name: 'idx_movie_id' },
      ],
      comment: 'movies comment',
    },
  );
  return Comment;
};
