'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cprCertification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cprCertification.init({
    document_id: DataTypes.STRING,
    worker_id: DataTypes.STRING,
    worker_name: DataTypes.STRING,
    course: DataTypes.STRING,
    issued_date: DataTypes.DATE,
    expiration_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'cprCertification',
  });

  cprCertification.removeAttribute('id'); // Remove the default 'id' attribute since we are using 'document_id' as the primary key
  
  return cprCertification;
};