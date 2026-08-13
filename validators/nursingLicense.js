const { DOC_TYPES, ERRORS, DATE, LICENSE_CLASSES } = require('../const/const');
const { compareDates, compareNames, validateDocDates } = require('../helpers/validatorsHelper');

const validate = (worker, doc) => {
    const errors = [];

    const dateErrors = validateDocDates(doc.issued_date, doc.expiration_date, 'NURSING_LICENSE');
    if (dateErrors.length > 0) {
        errors.push(...dateErrors);
    }

    const mismatchedData = [];
    if (!compareNames(worker, doc)) {
        mismatchedData.push('Entered name does not match name in document.');
    }

    if (LICENSE_CLASSES[worker.role] !== doc.class) {
        mismatchedData.push('Entered role does not match class in document.');
    }

    if (worker.province !== doc.province) {
        mismatchedData.push('Entered province does not match province in document.');
    }

    if (worker.licence_number !== doc.document_id) {
        mismatchedData.push('Entered license number does not match license number in document.');
    }

    if (compareDates(worker.licence_expiry, doc.date)) {
        mismatchedData.push('Entered expiration date does not match expiration date in document.');
    }

    if (mismatchedData.length > 0) {
        errors.push({ error: ERRORS.DOCUMENT_DATA_MISMATCH, details: mismatchedData });
    }

    return errors;
};

module.exports = {
    validate
};