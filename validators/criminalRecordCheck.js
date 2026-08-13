const { DOC_TYPES, ERRORS, DATE, CRIMINAL_RECORD_RESULTS } = require('../const/const');
const { compareDates, compareNames, validateDocDates } = require('../helpers/validatorsHelper');

const validate = (worker, doc) => {
    const errors = [];

    const dateErrors = validateDocDates(doc.date, null, 'CRIMINAL_RECORD_CHECK');
    if (dateErrors.length > 0) {
        errors.push(dateErrors);
    }

    if (doc.result != CRIMINAL_RECORD_RESULTS.NONE){
        errors.push({ error: ERRORS.CRIMINAL_RECORD_FOUND });
    }

    const mismatchedData = [];
    if (!compareNames(worker, doc)) {
        mismatchedData.push('Entered name does not match name in document.');
    }

    if (compareDates(worker.crc_expiry, doc.date)) {
        mismatchedData.push('Entered expiration date does not match expiration date in document.')
    }

    if (mismatchedData.length > 0) {
        errors.push({ error: ERRORS.DOCUMENT_DATA_MISMATCH, details: mismatchedData })
    }

    return errors;
};

module.exports = {
    validate
};