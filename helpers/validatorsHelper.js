const { DATE, DOC_TYPES, TZ_DIFF, ERRORS } = require('../const/const');

const compareDates = (date1, date2) => {

    // Special case if either date is null, that means it's an expiration date that never expires.
    if (date1 === null && date2 === null) {
        return 0;
    }
    if (date1 === null) {
        return 1;
    }
    if (date2 === null) {
        return -1;
    }

    // Hack for time zone differences.
    const diff = new Date(date1).getTime() - new Date(date2).getTime();
    if (Math.abs(diff) <= TZ_DIFF) {
        return 0;
    }
    return (diff);
}

const compareNames = (worker, doc) => {
    return `${worker.first_name} ${worker.last_name}` === doc.worker_name;
}

const validateDocDates = (issuedDate, expirationDate, docType) =>{
    const errors = [];
    const issuedDateField = docType === 'CRIMINAL_RECORD_CHECK' ? DOC_TYPES[docType].fields.date : DOC_TYPES[docType].fields.issued_date;
    const expirationDateField = DOC_TYPES[docType].fields.expiration_date;

    if (expirationDate) {
        if (compareDates(DATE, expirationDate) > 0) {
            errors.push({ error: ERRORS.DOCUMENT_EXPIRED });
        }
    } 
    
    if (issuedDate && compareDates(DATE, issuedDate) < 0) {
        errors.push({ error: ERRORS.DOCUMENT_INVALID, details: `Field '${issuedDateField}' is in the future.` });
    }

    if (issuedDate && expirationDate && compareDates(issuedDate, expirationDate) > 0) {
        errors.push({ error: ERRORS.DOCUMENT_INVALID, details: `Field '${issuedDateField}' is a date after field '${expirationDateField}'.` });
    }

    return errors;
}

module.exports = {
    compareDates,
    compareNames,
    validateDocDates
};