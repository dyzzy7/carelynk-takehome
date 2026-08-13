'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class photoId extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  photoId.init({
    document_id: DataTypes.STRING,
    worker_id: DataTypes.STRING,
    worker_name: DataTypes.STRING,
    date_of_birth: DataTypes.STRING,
    issued_date: DataTypes.DATE,
    expiration_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'photoId',
  });

  photoId.removeAttribute('id'); // Remove the default 'id' attribute since we are using 'document_id' as the primary key
  
  return photoId;
};