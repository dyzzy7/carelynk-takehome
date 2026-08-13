const { DATE, DOC_TYPES, TZ_DIFF, ERRORS } = require('../const/const');

/*
 * Helper method to compare 2 dates.
 *
 * @param date1 - first date
 * @param date2 - second date
 * 
 * @return 0 if date1 and date2 are the same date
 *         negative number if date1 is before date2
 *         positive number if date1 is after date2
 */
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

    // Finally, just return date difference
    return (diff);
}

/*
 * Helper method to compare worker name and name on document
 *
 * @param worker - worker data
 * @param doc - doc data
 * 
 * @return true if the names are the same
 *         false if the names are different
 * 
 */
const compareNames = (worker, doc) => {
    return `${worker.first_name} ${worker.last_name}` === doc.worker_name;
}

/*
 * Validate dates in document.
 * 
 * @param issuedDate - issued date of document (or date for CRC)
 * @param expirationDate - expiration date of document
 * @param docType - type of document
 * 
 * @return list of errors if dates are invalid in any way
 */
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