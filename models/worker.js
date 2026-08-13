'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class worker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  worker.init({
    worker_id: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.ENUM('RN', 'LPN', 'CCA'),
    province: DataTypes.ENUM('NS', 'NB', 'PEI', 'NL'),
    licence_number: DataTypes.STRING,
    licence_expiry: DataTypes.DATE,
    cpr_expiry: DataTypes.DATE,
    crc_date: DataTypes.DATE,
    permit_type: DataTypes.ENUM('Canadian Citizen (Passport)', 'Permanent Resident Card', 'Post-Graduation Work Permit','Open Work Permit'),
    permit_expiry: DataTypes.DATE,
    years_experience: DataTypes.INTEGER,
    submitted_on: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'worker',
  });

  worker.removeAttribute('id'); // Remove the default 'id' attribute since we are using 'worker_id' as the primary key

  return worker;
};