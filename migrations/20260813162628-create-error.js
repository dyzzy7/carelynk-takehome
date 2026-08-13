'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('errors', {
      worker_id: {
        references: {
          model: 'workers',
          key: 'worker_id'
        },
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      filename: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      error: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      details: {
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
    await queryInterface.dropTable('errors');
  }
};