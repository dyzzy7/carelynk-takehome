'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('workers', {
      worker_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.ENUM('RN', 'LPN', 'CCA')
      },
      province: {
        type: Sequelize.ENUM('NS', 'NB', 'PEI', 'NL')
      },
      licence_number: {
        type: Sequelize.STRING
      },
      licence_expiry: {
        type: Sequelize.DATE
      },
      cpr_expiry: {
        type: Sequelize.DATE
      },
      crc_date: {
        type: Sequelize.DATE
      },
      permit_type: {
        type: Sequelize.ENUM('Canadian Citizen (Passport)', 'Permanent Resident Card', 'Post-Graduation Work Permit', 'Open Work Permit')
      },
      permit_expiry: {
        type: Sequelize.DATE
      },
      years_experience: {
        type: Sequelize.INTEGER
      },
      submitted_on: {
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
    await queryInterface.dropTable('workers');
  }
};