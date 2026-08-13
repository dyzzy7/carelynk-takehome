const { DOC_TYPES, ERRORS, DATE } = require('../const/const');
const { compareDates, compareNames } = require('../helpers/validatorsHelper');

const validate = (worker, doc) => {
    const errors = [];

    const mismatchedData = [];
    if (!compareNames(worker, doc)) {
        mismatchedData.push('Entered name does not match name in document.');
    }

    if (mismatchedData.length > 0) {
        errors.push({ error: ERRORS.DOCUMENT_DATA_MISMATCH, details: mismatchedData })
    }

    return errors;
};

module.exports = {
    validate
};