'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('workPermits', {
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
      type: {
        type: Sequelize.ENUM('Canadian Citizen (Passport)', 'Permanent Resident Card', 'Post-Graduation Work Permit', 'Open Work Permit')
      },
      issued_date: {
        type: Sequelize.DATE
      },
      expiration_date: {
        type: Sequelize.DATE
      },
      conditions: {
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
    await queryInterface.dropTable('workPermits');
  }
};