const { Model, DataTypes, Sequelize } = require('sequelize');

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
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      modelName: 'movie',
      charset: 'utf8mb4',
      comment: 'IMDB movies',
    },
  );
  return Movie;
};
