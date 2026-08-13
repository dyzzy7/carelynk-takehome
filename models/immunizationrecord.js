'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class immunizationRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  immunizationRecord.init({
    document_id: DataTypes.STRING,
    worker_id: DataTypes.STRING,
    worker_name: DataTypes.STRING,
    hepatitis_b: DataTypes.STRING,
    mmr: DataTypes.STRING,
    tdap: DataTypes.DATE,
    influenza: DataTypes.STRING,
    tb: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'immunizationRecord',
  });

  immunizationRecord.removeAttribute('id'); // Remove the default 'id' attribute since we are using 'document_id' as the primary key
  
  return immunizationRecord;
};