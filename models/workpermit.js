'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class workPermit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  workPermit.init({
    worker_id: DataTypes.STRING,
    document_id: DataTypes.STRING,
    worker_name: DataTypes.STRING,
    type: DataTypes.ENUM('Canadian Citizen (Passport)', 'Permanent Resident Card', 'Post-Graduation Work Permit', 'Open Work Permit'),
    issued_date: DataTypes.DATE,
    expiration_date: DataTypes.DATE,
    conditions: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'workPermit',
  });

  workPermit.removeAttribute('id'); // Remove the default 'id' attribute since we are using 'worker_id' as the primary key

  return workPermit;
};