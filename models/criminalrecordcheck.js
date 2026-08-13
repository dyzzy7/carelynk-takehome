'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class criminalRecordCheck extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  criminalRecordCheck.init({
    document_id: DataTypes.STRING,
    worker_id: DataTypes.STRING,
    worker_name: DataTypes.STRING,
    purpose: DataTypes.STRING,
    date: DataTypes.DATE,
    result: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'criminalRecordCheck',
  });

  criminalRecordCheck.removeAttribute('id'); // Remove the default 'id' attribute since we are using 'document_id' as the primary key
  
  return criminalRecordCheck;
};