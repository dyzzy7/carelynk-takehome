'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('criminalRecordChecks', {
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
      purpose: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      result: {
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
    await queryInterface.dropTable('criminalRecordChecks');
  }
};