const { Model, DataTypes, Sequelize } = require('sequelize');
const moment = require('moment');

class Movie extends Model {}

module.exports = (sequelize) => {
  Movie.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        comment: 'movie id',
      },
      name: {
        type: DataTypes.STRING(300),
        comment: 'movie name',
      },
      releaseDate: {
        type: Sequelize.DATE,
        comment: 'movie release data',
      },
      avgRating: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 4,
        },
        comment: 'average movie rating',
      },
      ratingCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'movie rating count',
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
      modelName: 'movie',
      charset: 'utf8mb4',
      comment: 'IMDB movies',
    },
  );
  return Movie;
};
