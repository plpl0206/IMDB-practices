const { Model, DataTypes, Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
  static async createUserByEmail(email, username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    try {
      newUser = await this.create({
        username,
        password: hashedPassword,
        email,
      });
    } catch (err) {
      console.log(err);
      err.isError = true;
      return err;
    }
    return newUser;
  }

  static async emailExisted(email) {
    const count = await this.count({ where: { email } });
    return count > 0;
  }

  static async authenticate(email, password) {
    const user = await this.findOne({ where: { email } });
    if (user === null) {
      throw Error('user not exist');
    }

    const pass = await bcrypt.compare(password, user.password);
    if (pass !== true) {
      throw Error('password error');
    }
    return user;
  }

  static async getUserById(userId) {
    const user = await this.findOne({ where: { userId } });
    return user;
  }

  static async getNoPwdUserById(userId) {
    const user = await this.findOne({
      where: { userId },
      attributes: { exclude: ['password'] },
    });
    return user;
  }
}

module.exports = (sequelize) => {
  User.init(
    {
      userId: {
        type: Sequelize.UUID,
        field: 'user_id',
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
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
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      modelName: 'user',
      charset: 'utf8mb4',
      comment: 'IMDB comment user',
    },
  );

  return User;
};
