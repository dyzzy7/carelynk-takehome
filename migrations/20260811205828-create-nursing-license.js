'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('nursingLicenses', {
      document_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      worker_id: {
        type: Sequelize.STRING,
        references: {
          model: 'workers',
          key: 'worker_id'
        }
      },
      worker_name: {
        type: Sequelize.STRING
      },
      class: {
        type: Sequelize.ENUM('Continuing Care Assistant', 'Licensed Practical Nurse', 'Registered Nurse')
      },
      province: {
        type: Sequelize.ENUM('NS', 'NB', 'PEI', 'NL')
      },
      issued_date: {
        type: Sequelize.DATE
      },
      expiration_date: {
        type: Sequelize.DATE
      },
      standing: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('nursingLicenses');
  }
};