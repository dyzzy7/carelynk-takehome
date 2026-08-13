const DOC_TYPES = Object.freeze({
    WORK_PERMIT: {
        filename: 'work_permit.pdf',
        model: 'workPermit',
        fields: {
            'worker_name': 'Holder',
            'document_id': 'Document No.',
            'type': 'Type',
            'issued_date': 'Issued',
            'expiration_date': 'Expiry',
            'conditions': 'Conditions'
        }
    }, 
    PHOTO_ID: {
        filename: 'photo_id.pdf',
        model: 'photoId',
        fields: {
            'worker_name': 'Name',
            'document_id': 'ID Number',
            'date_of_birth': 'Date of Birth',
            'issued_date': 'Issued',
            'expiration_date': 'Expires'
        }
    },
    NURSING_LICENSE: {
        filename: 'nursing_licence.pdf',
        model: 'nursingLicense',
        fields: {
            'worker_name': 'Registrant Name',
            'document_id': 'Registration Number',
            'class': 'Class of Licence',
            'province': 'Province',
            'issued_date': 'Valid From',
            'expiration_date': 'Expires',
            'standing': 'Standing'
        }
    },
    IMMUNIZATION_RECORD: {
        filename: 'immunization_record.pdf',
        model: 'immunizationRecord',
        fields: {
            'worker_name': 'Patient',
            'hepatitis_b': 'Hepatitis B',
            'mmr': 'MMR',
            'tdap': 'Tdap',
            'influenza': 'Influenza (current season)',
            'tb': 'TB Screening'
        }
    },
    CRIMINAL_RECORD_CHECK: {
        filename: 'criminal_record_check.pdf',
        model: 'criminalRecordCheck',
        fields: {
            'worker_name': 'Applicant',
            'document_id': 'File Number',
            'purpose': 'Purpose',
            'date': 'Date of Search',
            'result': 'Result'
        },
    },
    CPR_CERTIFICATION: {
        filename: 'cpr_certification.pdf',
        model: 'cprCertification',
        fields: {
            'worker_name': 'Participant',
            'document_id': 'Certificate No.',
            'course': 'Course',
            'issued_date': 'Completed',
            'expiration_date': 'Expires'
        }
    }
});

const ERRORS = Object.freeze({
    DOCUMENT_MISSING: 'Document missing.',
    DOCUMENT_UNREADABLE: 'Unable to read document.',
    DOCUMENT_INVALID: 'Invalid document.',
    DOCUMENT_EXPIRED: 'Document is expired.',
    DOCUMENT_DATA_MISMATCH: 'Data entered by worker does not match data in document.',
    CRIMINAL_RECORD_FOUND: 'Worker has a criminal record.',
});

const DATE = new Date('August 10, 2026');

// Hack for timezone differences
const TZ_DIFF = 14400000;

const CRIMINAL_RECORD_RESULTS = Object.freeze({
    NONE: 'NO CRIMINAL RECORD FOUND'
});

const LICENSE_CLASSES = Object.freeze({
    CCA: 'Continuing Care Assistant',
    RN: 'Registered Nurse',
    LPN: 'Licensed Practical Nurse'
});

module.exports = {
    DOC_TYPES,
    ERRORS,
    DATE,
    TZ_DIFF,
    CRIMINAL_RECORD_RESULTS,
    LICENSE_CLASSES
};