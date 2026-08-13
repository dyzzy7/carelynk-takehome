'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('immunizationRecords', {
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
      hepatitis_b: {
        type: Sequelize.STRING
      },
      mmr: {
        type: Sequelize.STRING
      },
      tdap: {
        type: Sequelize.DATE
      },
      influenza: {
        type: Sequelize.STRING
      },
      tb: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('immunizationRecords');
  }
};