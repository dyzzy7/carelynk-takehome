'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class error extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  error.init({
    worker_id: DataTypes.STRING,
    filename: DataTypes.STRING,
    error: DataTypes.STRING,
    details: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'error',
  });

  error.removeAttribute('id');

  return error;
};