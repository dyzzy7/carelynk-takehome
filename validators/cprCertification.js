const { DOC_TYPES, ERRORS, DATE } = require('../const/const');
const { compareDates, compareNames, validateDocDates } = require('../helpers/validatorsHelper');

const validate = (worker, doc) => {
    const errors = [];

    const dateErrors = validateDocDates(doc.issued_date, doc.expiration_date, 'CPR_CERTIFICATION');
    if (dateErrors.length > 0) {
        errors.push(...dateErrors);
    }

    const mismatchedData = [];
    if (!compareNames(worker, doc)) {
        mismatchedData.push('Entered name does not match name in document.');
    }

    if (compareDates(worker.cpr_expiry, doc.expiration_date)) {
        mismatchedData.push('Entered expiration date does not match expiration date in document.')
    }

    if (mismatchedData.length > 0) {
        errors.push({ error: ERRORS.DOCUMENT_DATA_MISMATCH, details: mismatchedData });
    }

    return errors;
};

module.exports = {
    validate
};