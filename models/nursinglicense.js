'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class nursingLicense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  nursingLicense.init({
    document_id: DataTypes.STRING,
    worker_id: DataTypes.STRING,
    worker_name: DataTypes.STRING,
    class: DataTypes.ENUM('Continuing Care Assistant', 'Licensed Practical Nurse', 'Registered Nurse'),
    province: DataTypes.ENUM('NS', 'NB', 'PEI', 'NL'),
    issued_date: DataTypes.DATE,
    expiration_date: DataTypes.DATE,
    standing: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'nursingLicense',
  });

  nursingLicense.removeAttribute('id'); // Remove the default 'id' attribute since we are using 'document_id' as the primary key

  return nursingLicense;
};