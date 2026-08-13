const fs = require('fs');
const models = require('../models');
const validators = require('../validators');
const { DOC_TYPES } = require('../const/const');

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

const validateWorkers = async (workers, docs) => {
	const currentErrors = await models.error.findAll({ raw: true });
	const result = {};
	currentErrors.forEach(({ worker_id, filename, error, details }) => {
		result[worker_id] = result[worker_id] || {};
		result[worker_id][filename] = result[worker_id][filename] || { result: 'Invalid document.', errors: [] };
		result[worker_id][filename].errors.push({ error, details: details ? details : undefined });
	});

	workers.forEach((worker) => {
		const workerId = worker.worker_id;
		const currentWorkerErrors = {};
		const workerDocsData = docs[worker.workerd];
		Object.keys(docs[workerId]).forEach((docType) => {
			const currentDocErrors = validators[docType].validate(worker, docs[workerId][docType]);
			if (currentDocErrors.length > 0) {
				currentWorkerErrors[DOC_TYPES[docType].filename] = { result: 'Errors found in validation.', errors: currentDocErrors };
			} else {
				currentWorkerErrors[DOC_TYPES[docType].filename] = { result: 'Validation successful.' };
			}
		})

		if (worker.years_experience < 2) {
			currentWorkerErrors.general_errors = { error: "Worker has less than 2 years of experience. "};
		}

		if (Object.keys(currentWorkerErrors).length > 0) {
			result[workerId] = currentWorkerErrors;
		}
	});

	return Object.fromEntries(Object.entries(result).sort());
}

module.exports = {
	processWorkers,
	validateWorkers
};