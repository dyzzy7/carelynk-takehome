const fs = require('fs');
const models = require('../models');
const validators = require('../validators');
const { DOC_TYPES } = require('../const/const');

/* 
 * Helper method to parse csv
 * 
 * @param csv - csv data
 * 
 * @return Object of csv data in { header: data } format
 */
const parseCsv = (csv) => {
	const lines = csv.trim().split(/\r?\n/);
	const headers = lines.shift().split(',');

	return lines.map((line) => {
	const values = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < line.length; i += 1) {
		const char = line[i];

		if (char === '"') {
		inQuotes = !inQuotes;
		continue;
		}

		if (char === ',' && !inQuotes) {
		values.push(current);
		current = '';
		continue;
		}

		current += char;
	}

	values.push(current);

	return headers.reduce((row, header, index) => {
		row[header] = values[index] === '' ? null : values[index];
		return row;
	}, {});
	});
};

/*
 * Map data row to worker model
 *
 * @param row - worker data
 * 
 * @return worker model
 */
const mapRow = (row) => ({
	worker_id: row.worker_id,
	first_name: row.first_name,
	last_name: row.last_name,
	email: row.email,
	role: row.role,
	province: row.province,
	licence_number: row.licence_number,
	licence_expiry: new Date(row.licence_expiry),
	cpr_expiry: new Date(row.cpr_expiry),
	crc_date: new Date(row.crc_date),
	permit_type: row.permit_type,
	permit_expiry: row.permit_expiry? new Date(row.permit_expiry) : null, // Special case if permit is permanent
	years_experience: row.years_experience ? parseInt(row.years_experience, 10) : null,
	submitted_on: new Date(row.submitted_on),
	createdAt: new Date(),
	updatedAt: new Date()
});

/*
 * Process workers, upload to db, and return data in { workerId: data } format
 * 
 * @param filePath - path to csv file
 * 
 * @return Object of worker data
 */
const processWorkers = async (filePath) => {
	try {
		const csv = fs.readFileSync(filePath, 'utf8');
		const parsed = parseCsv(csv);
		const profiles = parseCsv(csv).map(mapRow);
		const results = await models.worker.bulkCreate(profiles, {
			conflictAttributes: ['worker_id'],
			updateOnDuplicate: Object.keys(profiles[0]),
			raw: true
		});
		return results.reduce((acc, worker) => {
			acc[worker.worker_id] = worker.dataValues;
			return acc;
		}, {});
	} catch (error) {
		console.error('Error processing profiles:', error);
		throw error;
	}
};

/*
 * Validate worker-entered data against data from docs.
 *
 * @param workers - all worker data in { workerId: data } format
 * @docs - all docs data in { workerId: filename: data } format
 * 
 * @return validation results in { workerId: filname: results } format
 */
const validateWorkers = async (workers, docs) => {
	const currentErrors = await models.error.findAll({ raw: true });
	const validationResults = {};
	const errorsData = [];
	
	// Load existing errors
	currentErrors.forEach(({ worker_id, filename, error, details }) => {
		validationResults[worker_id] = validationResults[worker_id] || {};
		validationResults[worker_id][filename] = validationResults[worker_id][filename] || { result: 'Invalid document.', errors: [] };
		validationResults[worker_id][filename].errors.push({ error, details: details || undefined });
	});

	workers.forEach((worker) => {
		const workerId = worker.worker_id;
		const workerDocsData = docs[workerId];

		Object.keys(DOC_TYPES).forEach((docType) => {
			const filename = DOC_TYPES[docType].filename;
			validationResults[workerId] = validationResults[workerId] || {};
			validationResults[workerId][filename] = validationResults[workerId][filename] || {};

			// If we loaded existing data for this doc
			if (validationResults[workerId][filename]?.errors) {
				validationResults[workerId][filename].result = 'Errors found in validation.'
				return;
			};

			// Run validator on worker data and doc data
			const currentDocErrors = validators[docType].validate(worker, docs[workerId][docType]);
			
			// If we found an error, add it to the list and prep an error model to upload to db
			if (currentDocErrors.length > 0) {
				validationResults[workerId][filename] = { result: 'Errors found in validation.', errors: currentDocErrors };
				currentDocErrors.forEach((error) => {
					errorsData.push({
						worker_id: workerId,
						filename: filename,
						error: error.error,
						details: error.details
					});
				})
			} else {
				// Otherwise, add 'Validation successful' result
				validationResults[workerId][filename] = { result: 'Validation successful.' };
			}
		})

		// Check if worker has <2 years experience
		if (worker.years_experience < 2) {
			const message = 'Worker has less than 2 years of experience.';
			validationResults[workerId].general_errors = { error: message };
			errorsData.push({
				worker_id: workerId,
				filename: 'general_errors',
				error: message
			});
		}
	});

	// Upload all errors to db
	await models.error.bulkCreate(errorsData, { ignoreDuplicates: true });

	// Sort entries by worker IDs before returning
	return Object.fromEntries(Object.entries(validationResults).sort());
}

module.exports = {
	processWorkers,
	validateWorkers
};