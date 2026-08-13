'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class workerErrorMap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  workerErrorMap.init({
    worker_id: DataTypes.STRING,
    error_id: DataTypes.INTEGER,
    additional_info: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'workerErrorMap',
  });

  workerErrorMap.removeAttribute('id'); // Remove the default 'id' attribute since we are using 'worker_id' and 'error_id' as the composite primary key

  return workerErrorMap;
};